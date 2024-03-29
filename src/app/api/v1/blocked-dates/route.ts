import { prisma } from '@/lib/prisma'
import { convertNumberTwoDigitsString } from '@/utils/convert-number-two-digits-string'
import { type NextRequest } from 'next/server'

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

  const lastDay = availableWeekDays[0].final_day
  const startDay = availableWeekDays[0].start_day

  const weekDays = [0, 1, 2, 3, 4, 5, 6]

  const blockedWeekDays = weekDays.filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    WITH TotalTables AS (
      SELECT
        SUM(chair_count) AS chairs
      FROM
        tables
    )
    
    SELECT
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      (((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60) * TT.chairs ) AS size
    FROM schedulings S

    LEFT JOIN available_schedules AVS
      ON AVS.week_day = EXTRACT(DOW FROM S.date)

    CROSS JOIN TotalTables TT

    WHERE TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}

    GROUP BY EXTRACT(DAY FROM S.date), 
      ((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60),
      TT.chairs, AVS.week_day

    HAVING 
      COUNT(S.date) >= (((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60) * TT.chairs );
  `

  const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

  return Response.json({ blockedWeekDays, blockedDates, startDay, lastDay })
}
