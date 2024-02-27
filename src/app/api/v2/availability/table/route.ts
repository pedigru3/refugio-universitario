/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimeZone from 'dayjs/plugin/timezone'

import { type NextRequest } from 'next/server'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimeZone)

// Define the handler for the GET request
export async function GET(request: NextRequest) {
  // Added 3 hours cause the American/Sao_Paulo Timezone
  //  const referenceDate = dayjs
  //  .utc(String(dateParam))
  //  .set('hour', Number(hourParam) + 3)

  const searchParams = request.nextUrl.searchParams

  const tableId = searchParams.get('id')
  const dateParams = searchParams.get('date')

  if (!tableId) {
    return Response.json({ error: 'id not provided.' }, { status: 400 })
  }

  if (!dateParams) {
    return Response.json({ error: 'date not provided.' }, { status: 400 })
  }

  const appointments = await prisma.scheduling.findMany({
    where: {
      table_id: tableId,
      date: {
        gte: dayjs.utc(dateParams).tz('America/Sao_Paulo').toISOString(),
      },
      AND: {
        date: {
          lte: dayjs
            .utc(dateParams)
            .set('hour', 23)
            .set('minute', 59)
            .tz('America/Sao_Paulo')
            .toISOString(),
        },
      },
    },
    select: {
      date: true,
    },
  })

  const busyTimes = appointments.map((h) => dayjs(h.date).get('hour'))

  const availableSchedule = await prisma.availableSchedule.findFirst({
    where: {
      week_day: dayjs(dateParams).get('day'),
    },
  })

  if (!availableSchedule) {
    return Response.json(
      {
        error: 'Horários disponíveis não configurado',
      },
      { status: 400 },
    )
  }

  let startHour = availableSchedule?.time_start_in_minutes / 60
  const endHour = availableSchedule?.time_end_in_minutes / 60
  const spentTime = endHour - startHour

  const possibleTimes = []

  for (let i = 0; i < spentTime; i++) {
    possibleTimes.push(startHour)
    startHour += 1
  }

  const availabilityTimes = possibleTimes.filter(
    (hour) => !busyTimes.includes(hour),
  )

  return Response.json({
    possibleTimes,
    availableTimes: availabilityTimes,
  })
  // Return the availability information as a JSON response
}
