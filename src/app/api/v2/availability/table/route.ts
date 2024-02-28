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
  // IF YOU WANT ADD MORE TIME PARA AGENDAMENTO COM ANTECEDENCIA
  const hoursInAdvance = 1

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
        gte: dayjs(dateParams).startOf('date').toISOString(),
      },
      AND: {
        date: {
          lte: dayjs(dateParams).endOf('date').toISOString(),
        },
      },
    },
    select: {
      date: true,
      table: {
        select: {
          chair_count: true,
        },
      },
    },
  })

  interface Appoitment {
    date: Date
    table: {
      chair_count: number
    }
  }

  interface AppoitmentResponse {
    date: string
    count: number
    max: number
  }

  function groupByDate(objects: Appoitment[]): AppoitmentResponse[] {
    const groupedObjects: {
      [key: string]: { count: number; max: number }
    } = {}

    objects.forEach((obj) => {
      const dateString = obj.date.toISOString() // Obter a data como uma string ISO completa
      if (!groupedObjects[dateString]) {
        groupedObjects[dateString] = { count: 0, max: obj.table.chair_count }
      }
      groupedObjects[dateString].count++
      groupedObjects[dateString].max = obj.table.chair_count
    })

    return Object.keys(groupedObjects).map((key) => ({
      date: key,
      count: groupedObjects[key].count,
      max: groupedObjects[key].max,
    }))
  }

  const newAppointments = groupByDate(appointments)

  const busyTimes: number[] = newAppointments.reduce((acc: number[], h) => {
    if (h.count >= h.max) {
      acc.push(dayjs.utc(h.date).tz('America/Sao_Paulo').get('hour'))
    }
    return acc
  }, [])

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

  const currentDate = dayjs.utc(new Date())

  function isToday(): boolean {
    return (
      dayjs.utc(dateParams).tz('America/Sao_Paulo').toISOString() ===
      currentDate.startOf('date').tz('America/Sao_Paulo').toISOString()
    )
  }

  if (isToday()) {
    const currentHour = currentDate.tz('America/Sao_Paulo').hour()
    if (startHour < currentHour) {
      const diffTime = currentHour - startHour + 1 + hoursInAdvance
      let hourToAdd = startHour
      for (let i = 0; i < diffTime; i++) {
        busyTimes.push(hourToAdd)
        hourToAdd += 1
      }
    }
  }

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
