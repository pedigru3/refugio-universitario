/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { type NextRequest } from 'next/server'

type TableAvailability = {
  table_id: string
  table_name: string
  isAvailable: boolean
  empty_chairs: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const date = searchParams.get('date')

  if (!date) {
    return Response.json({ error: 'Date not provided.' }, { status: 400 })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return Response.json({
      availability: [],
      message: 'the date received is old',
    })
  }

  const availableSchedule = await prisma.availableSchedule.findFirst({
    where: {
      week_day: referenceDate.get('day'),
    },
  })

  if (!availableSchedule) {
    return Response.json({
      availability: [],
      message: 'Day not released',
    })
  }

  const { time_start_in_minutes, time_end_in_minutes } = availableSchedule

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({
    length: endHour - startHour,
  }).map((_, i) => {
    return startHour + i
  })

  const possibleBlockedTimes = await Promise.all(
    possibleTimes.map(async (time) => {
      const result = await fetch(
        `http://localhost:3000/api/v1/availability/table?date=${date}&hour=${time}`,
      )

      const jsonTable = await result.json()
      const tableAvailability: TableAvailability[] = jsonTable.availability

      const allUnavailable = tableAvailability.every(
        (table) => !table.isAvailable,
      )

      if (!allUnavailable) {
        return time
      }
    }),
  )

  const blockedTimes = possibleBlockedTimes.filter((time) => time)

  return Response.json({ availability: blockedTimes })
}
