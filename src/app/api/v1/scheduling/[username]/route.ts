import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import dayjsUtc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

dayjs.extend(dayjsUtc)
dayjs.extend(timezone)

type RouteParams = {
  params: Promise<{ username: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { username } = await params

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
      date: {
        gte: new Date().toISOString(),
      },
    },
    select: {
      id: true,
      date: true,
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
  const { username } = await params

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

  if (session?.user.role !== 'admin' && userExists.id !== session?.user.id) {
    return Response.json({ error: 'unauthorized user' }, { status: 401 })
  }

  const BorySchema = z.object({
    date: z.string(),
    table_id: z.string().uuid().optional(),
    spent_time_in_minutes: z.number().optional(),
  })

  try {
    const bory = await request.json()
    const {
      date,
    } = BorySchema.parse(bory)

    const schedulingDate = dayjs(date)

    const alreadyScheduledTime =
      userExists.Scheduling.filter((scheduling: { date: Date }) => {
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

    await prisma.scheduling.create({
      data: {
        date,
        user_id: userExists.id,
        table_id: null as any,
      },
    })

    const calendar = google.calendar({
      version: 'v3',
      auth: await getGoogleOAuthToken(userExists.id),
    })

    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: 'Estudar: Refúgio Universitário',
        description: `Reserva de estudo.`,
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
    console.log(error)
    return Response.json(
      { error: `Something unexpected happened` },
      { status: 500 },
    )
  }
}
