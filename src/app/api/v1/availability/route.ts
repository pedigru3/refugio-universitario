/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/options'
import { z } from 'zod'
import { getTimeZoneOffset } from '@/utils/get-time-zone-offset'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimeZone from 'dayjs/plugin/timezone'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimeZone)

const timeIntervalSchema = z.object({
  weekDay: z.number(),
  startTimeInMinutes: z.number(),
  endTimeInMinutes: z.number(),
  finalDay: z.string().optional(),
})

const timeIntervalsBodySchema = z.object({
  intervals: z.array(timeIntervalSchema),
  lastDay: z
    .string()
    .refine((date) =>
      dayjs(date).isAfter(dayjs(new Date()).hour(23).minute(59)),
    ),
  startDay: z.string(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const date = searchParams.get('date')

  const timeZoneDiff = getTimeZoneOffset()

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

  const lastDay = availableSchedule?.final_day

  const isBlockedDateByLastDay = referenceDate
    .startOf('day')
    .isAfter(dayjs(lastDay).add(1, 'day'))

  if (isBlockedDateByLastDay) {
    return Response.json({
      possibleTimes: [],
      availableTimes: [],
      message: 'Day after last day',
    })
  }

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

  const blockedHoursRaw: Array<{ hour: number; amount: number; size: bigint }> =
    await prisma.$queryRaw`
    
  WITH TotalTables AS (
    SELECT SUM(chair_count) AS chairs
    FROM tables
  ),

  HourlyCounts AS (
    SELECT
      EXTRACT(HOUR FROM S.date) AS hour,
      COUNT(S.date) AS amount
    FROM schedulings S
    LEFT JOIN available_schedules AVS ON AVS.week_day = EXTRACT(DOW FROM S.date)
    LEFT JOIN tables TB ON TB.id = S.table_id
    WHERE TO_CHAR(S.date, 'YYYY-MM-DD') = ${`${referenceDate.format(
      'YYYY-MM-DD',
    )}`}
    GROUP BY EXTRACT(HOUR FROM S.date)
  )

  SELECT
    HC.hour,
    HC.amount,
    TT.chairs AS size
  FROM HourlyCounts HC
  LEFT JOIN TotalTables TT ON true
  WHERE HC.amount >= TT.chairs;
`

  // Aqui foi ajustado manualmente o fuso horário (-3 horas)
  const blockedHours = blockedHoursRaw.map((item) => item.hour - timeZoneDiff)

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedHours.some((hour) => hour === time)
    const isTimeInPast = referenceDate
      .utc()
      .set('hour', time + 3)
      .isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return Response.json({ possibleTimes, availableTimes })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const { intervals, lastDay, startDay } = timeIntervalsBodySchema.parse(body)

  const availableSchedules = await prisma.availableSchedule.findFirst()

  if (availableSchedules) {
    await prisma.availableSchedule.deleteMany()
  }

  await prisma.availableSchedule.createMany({
    data: intervals.map((interval) => {
      return {
        time_start_in_minutes: interval.startTimeInMinutes,
        time_end_in_minutes: interval.endTimeInMinutes,
        week_day: interval.weekDay,
        start_day: new Date(startDay),
        final_day: new Date(lastDay),
      }
    }),
  })

  return Response.json({}, { status: 201 })
}
