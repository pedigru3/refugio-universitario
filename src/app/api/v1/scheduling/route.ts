import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

type GroupedScheduling = {
  date: string
  schedules: { user: string; name: string; hours: string[] }[]
}[]

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

  const groupedScheduling: GroupedScheduling = []

  scheduling.forEach((entry) => {
    const date = dayjs(entry.date).format('DD/MM/YY')
    const hour = dayjs(entry.date).format('HH')
    const user = entry.user

    if (!groupedScheduling.find((item) => item.date === date)) {
      groupedScheduling.push({
        date,
        schedules: [
          {
            user: user.username,
            name: user.name,
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
          hours: [hour],
        })
      }
    }
  })

  return Response.json({ groupedScheduling })
}
