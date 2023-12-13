import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { google } from 'googleapis'
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

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  const BorySchema = z.object({
    date: z.string(),
    table_id: z.string(),
  })

  try {
    const bory = await request.json()

    const { date, table_id: tableId } = BorySchema.parse(bory)

    const schedulingDate = dayjs(date)

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
      { error: 'Something unexpected happened' },
      { status: 500 },
    )
  }
}
