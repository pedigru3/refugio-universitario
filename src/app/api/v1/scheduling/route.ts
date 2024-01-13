import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

interface GroupedScheduling {
  [date: string]: { user: string; name: string; hours: string[] }[]
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Não autorizado' }, { status: 404 })
  }

  const scheduling = await prisma.scheduling.findMany({
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
        },
      },
      date: true,
    },
  })

  const groupedScheduling: GroupedScheduling = {}

  scheduling.forEach((entry) => {
    const date = dayjs(entry.date).format('DD/MM/YY')
    const hour = dayjs(entry.date).format('HH')
    const user = entry.user

    if (!groupedScheduling[date]) {
      groupedScheduling[date] = [
        {
          user: user.username,
          name: user.name,
          hours: [hour],
        },
      ]
    } else {
      const existingEntry = groupedScheduling[date].find(
        (item) => item.user === user.username,
      )
      if (existingEntry) {
        existingEntry.hours.push(hour)
      } else {
        groupedScheduling[date].push({
          user: user.username,
          name: user.name,
          hours: [hour],
        })
      }
    }
  })

  return Response.json({ groupedScheduling })
}
