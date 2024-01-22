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
  const searchParams = request.nextUrl.searchParams

  const dateParam = searchParams.get('date')
  const startTime = searchParams.get('start-time')
  const endTime = searchParams.get('end-time')

  try {
    if (!dateParam) {
      return Response.json({ error: 'Date not provided.' }, { status: 400 })
    }

    if (!startTime) {
      return Response.json(
        { error: 'Start time not provided.' },
        { status: 400 },
      )
    }

    if (!startTime) {
      return Response.json({ error: 'End time not provided.' }, { status: 400 })
    }

    // Added 3 hours cause the American/Sao_Paulo Timezone
    const referenceDate = dayjs
      .utc(String(dateParam))
      .set('hour', Number(startTime) + 3)

    // Check if the reference date is in the past; if so, return a response indicating an old date
    const isPastDate = referenceDate.endOf('day').isBefore(new Date())
    if (isPastDate) {
      return Response.json({
        availability: [],
        message: 'the date received is old',
      })
    }

    const availabilityTables = await prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM sc.date) AS hour,
        tb.id, 
        tb.table_name, 
        tb.chair_count,
        COUNT(sc.id) AS scheduling_count
      FROM (
        SELECT
          id,
          table_name,
          chair_count
        FROM tables
      ) tb
      LEFT JOIN (
        SELECT
          id,
          table_id,
          date
        FROM
        schedulings
        WHERE
        schedulings.date >= '2024-01-30T12:00:00.000Z'
        AND schedulings.date <= '2024-01-30T15:00:00.000Z'
      ) sc ON sc.table_id = tb.id
      GROUP BY tb.id, tb.table_name, tb.chair_count, EXTRACT(HOUR FROM sc.date);
    `

    console.log(availabilityTables)

    return Response.json({ availability: availabilityTables })
  } catch (error) {
    return Response.json(
      { error: 'Something unexpected happened' },
      { status: 500 },
    )
  }
  // Return the availability information as a JSON response
}
