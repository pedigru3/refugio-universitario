/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimeZone from 'dayjs/plugin/timezone'

import { type NextRequest } from 'next/server'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimeZone)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const tableId = searchParams.get('id')
  const dateParams = searchParams.get('date')
  const startHour = Number(searchParams.get('hour'))

  if (!tableId) {
    return Response.json({ error: 'id not provided.' }, { status: 400 })
  }

  if (!dateParams) {
    return Response.json({ error: 'date not provided.' }, { status: 400 })
  }

  if (!startHour) {
    return Response.json({ error: 'hour not provided.' }, { status: 400 })
  }

  const nextAppointment = await prisma.scheduling.findFirst({
    where: {
      table_id: tableId,
      date: {
        gte: dayjs
          .utc(dateParams)
          .set('hour', Number(startHour) + 3)
          .tz('America/Sao_Paulo')
          .toISOString(),
      },
      AND: {
        date: {
          lte: dayjs(dateParams).endOf('date').toISOString(),
        },
      },
    },
    select: {
      date: true,
    },
  })

  console.log(nextAppointment)

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

  let endHour = availableSchedule?.time_end_in_minutes / 60

  if (nextAppointment) {
    endHour = nextAppointment.date.getHours()
  }

  const spentTime = endHour - startHour
  const availableTimes = []

  let hour = startHour + 1

  for (let i = 0; i < spentTime; i++) {
    availableTimes.push(hour)
    hour += 1
  }

  return Response.json({
    possibleTimes: availableTimes,
    availableTimes,
  })
}
