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
      possibleTimes: [],
      availableTimes: [],
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
      possibleTimes: [],
      availableTimes: [],
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

  /* const possibleBlockedTimes = await Promise.all(
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
  ) */

  const blockedHoursRaw: Array<{ hour: number }> = await prisma.$queryRaw`
    WITH TotalTables AS (
      SELECT
        SUM(chair_count) AS chairs
      FROM
        tables
    )

    SELECT
      EXTRACT(HOUR FROM S.date) AS hour,
      COUNT(S.date) AS amount,
      TT.chairs AS size
    FROM schedulings S

    LEFT JOIN available_schedules AVS
      ON AVS.week_day = EXTRACT(DOW FROM S.date)

    LEFT JOIN tables TB
      ON TB.id = S.table_id

    CROSS JOIN TotalTables TT

    WHERE TO_CHAR(S.date, 'YYYY-MM-DD') 
      = ${`${referenceDate.format('YYYY-MM-DD')}`}

    GROUP BY EXTRACT(HOUR FROM S.date),
    TB.chair_count,
    TT.chairs

    HAVING
      COUNT(S.date) >= TT.chairs
  `

  // Aqui foi ajustado manualmente o fuso horário (-3 horas)
  const blockedHours = blockedHoursRaw.map((item) => item.hour - 3)

  const availableTimes = possibleTimes.filter(
    (time) => !blockedHours.some((hour) => hour === time),
  )

  return Response.json({ possibleTimes, availableTimes })
}