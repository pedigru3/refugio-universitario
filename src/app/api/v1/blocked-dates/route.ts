import { prisma } from '@/lib/prisma'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')

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
    },
  })

  const weekDays = [0, 1, 2, 3, 4, 5, 6]

  const blockedWeekDays = weekDays.filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      (((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60) * TB.chair_count ) AS size
    FROM schedulings S

    LEFT JOIN available_schedules AVS
      ON AVS.week_day = EXTRACT(DOW FROM S.date)

    LEFT JOIN tables TB
      ON TB.id = S.table_id

    WHERE TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}

    GROUP BY EXTRACT(DAY FROM S.date), 
      ((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60),
      TB.chair_count

    HAVING 
      COUNT(S.date) >= (((AVS.time_end_in_minutes - AVS.time_start_in_minutes) / 60) * TB.chair_count );
  `

  const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

  console.log(blockedDatesRaw)

  return Response.json({ blockedWeekDays, blockedDates })
}
