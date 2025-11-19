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

  const dateParams = searchParams.get('date')

  if (!dateParams) {
    return Response.json({ error: 'date not provided.' }, { status: 400 })
  }

  const appointments = await prisma.scheduling.groupBy({
    by: ['table_id'],
    where: {
      date: {
        gte: dayjs(dateParams).startOf('date').toISOString(),
      },
      AND: {
        date: {
          lte: dayjs(dateParams).endOf('date').toISOString(),
        },
      },
    },
    _count: {
      id: true,
    },
  })

  const availableSchedule = await prisma.availableSchedule.findFirst({
    where: {
      week_day: dayjs(dateParams).get('day'),
    },
  })

  if (!availableSchedule) {
    return Response.json(
      { error: 'Horários não configurados' },
      { status: 400 },
    )
  }

  const availabilityHours =
    availableSchedule?.time_end_in_minutes / 60 -
    availableSchedule.time_start_in_minutes / 60

  const availabilityTables = await prisma.table.findMany({})

  const availability = availabilityTables.map((table) => {
    const scheduleFound = appointments.find(
      (appointment) => table.id === appointment.table_id,
    )

    if (scheduleFound) {
      return {
        table_id: table.id,
        table_name: table.table_name,
        is_available:
          scheduleFound._count.id < availabilityHours * table.chair_count,
      }
    }

    return {
      table_id: table.id,
      table_name: table.table_name,
      is_available: true,
    }
  })

  return Response.json({
    availability,
  })
  // Return the availability information as a JSON response
}
