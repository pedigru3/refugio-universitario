import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

type RouteParams = {
  params: { username: string }
}

export async function GET(request: Request, { params }: RouteParams) {
  const username = params.username

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  const appointments = await prisma.scheduling.findMany({
    where: {
      user_id: userExists.id,
    },
    select: {
      id: true,
      date: true,
      table: {
        select: {
          table_name: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  return Response.json({
    appointments,
  })
}

export async function POST(request: Request, { params }: RouteParams) {
  const username = params.username

  const [session, userExists] = await Promise.all([
    getServerSession(authOptions),
    prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        Scheduling: true,
      },
    }),
  ])

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  if (userExists.id !== session?.user.id) {
    return Response.json({ error: 'unauthorized user' }, { status: 401 })
  }

  const BorySchema = z.object({
    date: z.string(),
    table_id: z.string(),
    spent_time_in_minutes: z.number().optional(),
  })

  try {
    const bory = await request.json()
    const {
      date,
      table_id: tableId,
      spent_time_in_minutes: spentTimeInMinutes,
    } = BorySchema.parse(bory)

    const schedulingDate = dayjs(date)

    const alreadyScheduledTime =
      userExists.Scheduling.filter((scheduling) => {
        return scheduling.date.toISOString() === new Date(date).toISOString()
      }).length >= 1

    if (alreadyScheduledTime) {
      return Response.json(
        {
          error: 'This time has already been set by the user',
          message: 'Você já tem uma reserva nesse horário',
        },
        { status: 409 },
      )
    }

    const scheduling = await prisma.scheduling.create({
      data: {
        date,
        user_id: userExists.id,
        table_id: tableId,
      },
      include: {
        table: true,
      },
    })

    // Criação das próximas horas

    // 1. Descobrir quantas horas restam até o fim

    const availableSchedule = await prisma.availableSchedule.findFirst({})

    if (!availableSchedule) {
      return Response.json(
        { error: 'nenhum horário disponível' },
        { status: 400 },
      )
    }

    const timeStartInMinutes = scheduling.date.getHours() * 60
    let timeEndInMinutes = availableSchedule.time_end_in_minutes

    // Descobrir quantas horas restam até o proximo horario ocupado

    const nextAppointment = await prisma.scheduling.findFirst({
      where: {
        date: {
          gt: scheduling.date,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    if (nextAppointment) {
      console.log('hora do nextAppoitnment: ', nextAppointment.date.getHours())
      timeEndInMinutes = nextAppointment.date.getHours() * 60
    }

    // fazer um agendamento para cada próxima hora

    const nextSchedules: {
      date: string
      user_id: string
      table_id: string
    }[] = []

    // verificar se horário do usuário é valido

    if (spentTimeInMinutes) {
      const timeEndInMinutesSetByUser = timeStartInMinutes + spentTimeInMinutes

      if (timeEndInMinutesSetByUser <= timeEndInMinutes) {
        timeEndInMinutes = timeEndInMinutesSetByUser
      }
    }

    const spendTimeInHours = (timeEndInMinutes - timeStartInMinutes) / 60

    console.log('spendTimeInHours: ', spendTimeInHours)

    for (let i = 0; i < spendTimeInHours - 1; i++) {
      nextSchedules.push({
        date: dayjs(date)
          .add(i + 1, 'hour')
          .toISOString(),
        table_id: scheduling.table_id,
        user_id: scheduling.user_id,
      })
    }

    await prisma.scheduling.createMany({
      data: nextSchedules,
    })

    // Fim da criação das proximas horas

    const calendar = google.calendar({
      version: 'v3',
      auth: await getGoogleOAuthToken(userExists.id),
    })

    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: 'Estudar: Refúgio Universitário',
        description: `Reserva de estudo na ${scheduling.table.table_name}.`,
        start: {
          dateTime: schedulingDate.format(),
        },
        end: {
          dateTime: schedulingDate.add(1, 'hour').format(),
        },
        attendees: [{ email: userExists.email, displayName: userExists.name }],
      },
    })

    return Response.json({}, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: `Something unexpected happened` },
      { status: 500 },
    )
  }
}
