import { prisma } from '@/lib/prisma'
import { convertNumberTwoDigitsString } from '@/utils/convert-number-two-digits-string'
import { type NextRequest } from 'next/server'
import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const paramsMonth = searchParams.get('month')
  const month = convertNumberTwoDigitsString(paramsMonth)

  if (!year || !month) {
    return Response.json(
      { message: 'Year or month not specified.' },
      { status: 400 },
    )
  }

  const availableWeekDays = await prisma.availableSchedule.findMany({
    select: {
      week_day: true,
      final_day: true,
      start_day: true,
    },
  })

  const lastDay = availableWeekDays.length > 0 ? availableWeekDays[0].final_day : null
  const startDay = availableWeekDays.length > 0 ? availableWeekDays[0].start_day : null

  const weekDays = [0, 1, 2, 3, 4, 5, 6]

  const blockedWeekDays = weekDays.filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const config = await prisma.systemConfig.findUnique({
    where: { key: 'MAX_CAPACITY' },
  })
  const MAX_CAPACITY = config ? Number(config.value) : 20

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.date) AS date
    FROM schedulings S
    JOIN available_schedules AVS ON AVS.week_day = EXTRACT(DOW FROM S.date)
    WHERE TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}
    GROUP BY EXTRACT(DAY FROM S.date), AVS.time_start_in_minutes, AVS.time_end_in_minutes
    HAVING COUNT(S.date) >= ((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60) * ${MAX_CAPACITY};
  `

  const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

  // Manual blocked dates from the BlockedDates table
  const manualBlockedDates = await prisma.blockedDates.findMany({
    where: {
      date: {
        gte: dayjs(`${year}-${month}-01`).startOf('month').toISOString(),
        lte: dayjs(`${year}-${month}-01`).endOf('month').toISOString(),
      },
    },
  })

  const manualBlockedDays = manualBlockedDates.map((d) => dayjs(d.date).get('date'))

  return Response.json({
    blockedWeekDays,
    blockedDates: Array.from(new Set([...blockedDates, ...manualBlockedDays])),
    startDay,
    lastDay,
  })
}

export async function POST(request: NextRequest) {
  const { date } = await request.json()

  await prisma.blockedDates.create({
    data: {
      date: dayjs(date).startOf('day').toISOString(),
    },
  })

  return Response.json({ message: 'Date blocked' }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { date } = await request.json()

  await prisma.blockedDates.deleteMany({
    where: {
      date: dayjs(date).startOf('day').toISOString(),
    },
  })

  return Response.json({ message: 'Date unblocked' })
}
