import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimeZone from 'dayjs/plugin/timezone'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimeZone)

type GroupedScheduling = {
  date: string
  schedules: {
    user: string
    name: string
    course: string
    table: string
    hours: string[]
  }[]
}[]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Não autorizado' }, { status: 404 })
  }

  const scheduling = await prisma.scheduling.findMany({
    orderBy: {
      date: 'asc',
    },
    where: {
      date: {
        gte: new Date().toISOString(),
      },
    },
    select: {
      user: {
        select: {
          username: true,
          name: true,
          course: true,
        },
      },
      table: {
        select: {
          table_name: true,
        },
      },
      date: true,
    },
  })

  const groupedScheduling: GroupedScheduling = []

  scheduling.forEach((entry) => {
    const date = dayjs(entry.date).format('DD/MM/YY')
    const hour = dayjs
      .utc(String(entry.date))
      .tz('America/Sao_Paulo')
      .format('HH')
    const user = entry.user

    if (!groupedScheduling.find((item) => item.date === date)) {
      groupedScheduling.push({
        date,
        schedules: [
          {
            user: user.username,
            name: user.name,
            course: entry.user.course,
            table: entry.table.table_name,
            hours: [hour],
          },
        ],
      })
    } else {
      const existingDate = groupedScheduling.find((item) => item.date === date)
      const existingEntry = existingDate?.schedules.find(
        (item) => item.user === user.username,
      )
      if (existingEntry) {
        existingEntry.hours.push(hour)
      } else {
        existingDate?.schedules.push({
          user: user.username,
          name: user.name,
          course: entry.user.course,
          table: entry.table.table_name,
          hours: [hour],
        })
      }
    }
  })

  return Response.json({ groupedScheduling })
}
