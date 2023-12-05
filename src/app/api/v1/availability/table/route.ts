/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { type NextRequest } from 'next/server'

// Define the handler for the GET request
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const dateParam = searchParams.get('date')
  const hourParam = searchParams.get('hour')

  try {
    if (!dateParam) {
      return Response.json({ error: 'Date not provided.' }, { status: 400 })
    }

    if (!hourParam) {
      return Response.json({ error: 'Hour not provided.' }, { status: 400 })
    }

    const referenceDate = dayjs(String(dateParam)).set(
      'hour',
      Number(hourParam),
    )

    // Check if the reference date is in the past; if so, return a response indicating an old date
    const isPastDate = referenceDate.endOf('day').isBefore(new Date())
    if (isPastDate) {
      return Response.json({
        availability: [],
        message: 'the date received is old',
      })
    }

    // Retrieve all tables from the database with selected fields
    const allTables = await prisma.table.findMany({
      select: {
        id: true,
        chair_count: true,
        table_name: true,
      },
    })

    // Retrieve tables with schedulings for the reference date
    const tablesWithSchedulings = await prisma.table.findMany({
      where: {
        schedulings: {
          some: {
            date: referenceDate.toDate(),
          },
        },
      },
      include: {
        schedulings: {
          where: {
            date: referenceDate.toDate(),
          },
        },
      },
    })

    // Create a map for quick lookup of available schedule information by table ID
    const tablesWithSchedulingsMap = new Map(
      tablesWithSchedulings.map((item) => [item.id, item]),
    )

    // Generate availability information for each table
    const availabilityTables = allTables.map((table) => {
      const currentTable = tablesWithSchedulingsMap.get(table.id)
      if (!currentTable) {
        // If the table has no scheduled events, mark it as fully available
        return {
          table_id: table.id,
          table_name: table.table_name,
          isAvailable: true,
          empty_chairs: table.chair_count,
          chair_count: table.chair_count,
        }
      }
      // Calculate availability based on scheduled events and chair count
      return {
        table_id: currentTable?.id,
        table_name: currentTable.table_name,
        isAvailable:
          currentTable?.schedulings.length < currentTable.chair_count,
        empty_chairs:
          currentTable.chair_count - currentTable.schedulings.length,
        chair_count: currentTable.chair_count,
      }
    })
    return Response.json({ availability: availabilityTables })
  } catch (error) {
    return Response.json(
      { error: 'Something unexpected happened' },
      { status: 500 },
    )
  }
  // Return the availability information as a JSON response
}
