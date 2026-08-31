import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const CONFIG_KEYS = {
  isOpen: 'isOpen',
  maxCapacity: 'MAX_CAPACITY',
}

export async function GET() {
  try {
    const now = dayjs().tz('America/Sao_Paulo')
    const currentWeekDay = now.day()
    const currentMinutes = now.hour() * 60 + now.minute()

    // 1. Buscar configurações manuais e limite de pessoas
    const configs = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [CONFIG_KEYS.isOpen, CONFIG_KEYS.maxCapacity],
        },
      },
    })

    const map = configs.reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})

    // manualOpen é false apenas se o administrador fechar manualmente
    const manualIsOpen = map[CONFIG_KEYS.isOpen] !== 'false'
    const MAX_CAPACITY = Number(map[CONFIG_KEYS.maxCapacity]) || 20

    // 2. Buscar horários de funcionamento
    const allSchedules = await prisma.availableSchedule.findMany({
      orderBy: { week_day: 'asc' },
    })

    const schedule = allSchedules.find((s) => s.week_day === currentWeekDay)

    let isWithinBusinessHours = false
    if (schedule) {
      isWithinBusinessHours =
        currentMinutes >= schedule.time_start_in_minutes &&
        currentMinutes < schedule.time_end_in_minutes
    }

    // 3. Status Final: Aberto se (Manual AND Horário Comercial)
    const isOpen = manualIsOpen && isWithinBusinessHours

    // 4. Calcular próximo evento (fecha em / abre em)
    let nextEvent: {
      type: 'closes' | 'opens' | 'none'
      title: string
      targetTime: string | null
      targetLabel: string | null
    } = {
      type: 'none',
      title: 'Sem horário',
      targetTime: null,
      targetLabel: null,
    }

    if (isOpen && schedule) {
      const closeTarget = now
        .startOf('day')
        .add(schedule.time_end_in_minutes, 'minute')
      const closeHours = Math.floor(schedule.time_end_in_minutes / 60)
        .toString()
        .padStart(2, '0')
      const closeMins = (schedule.time_end_in_minutes % 60)
        .toString()
        .padStart(2, '0')

      nextEvent = {
        type: 'closes',
        title: 'Fecha em',
        targetTime: closeTarget.toISOString(),
        targetLabel: `Hoje às ${closeHours}:${closeMins}`,
      }
    } else if (!manualIsOpen) {
      nextEvent = {
        type: 'none',
        title: 'Fechado',
        targetTime: null,
        targetLabel: 'Fechado temporariamente',
      }
    } else {
      // Aberto hoje mais tarde?
      if (schedule && currentMinutes < schedule.time_start_in_minutes) {
        const openTarget = now
          .startOf('day')
          .add(schedule.time_start_in_minutes, 'minute')
        const openHours = Math.floor(schedule.time_start_in_minutes / 60)
          .toString()
          .padStart(2, '0')
        const openMins = (schedule.time_start_in_minutes % 60)
          .toString()
          .padStart(2, '0')

        nextEvent = {
          type: 'opens',
          title: 'Abre em',
          targetTime: openTarget.toISOString(),
          targetLabel: `Hoje às ${openHours}:${openMins}`,
        }
      } else if (allSchedules.length > 0) {
        // Procurar nos próximos 7 dias
        for (let i = 1; i <= 7; i++) {
          const targetWeekDay = (currentWeekDay + i) % 7
          const nextSched = allSchedules.find((s) => s.week_day === targetWeekDay)
          if (nextSched) {
            const openTarget = now
              .add(i, 'day')
              .startOf('day')
              .add(nextSched.time_start_in_minutes, 'minute')
            const openHours = Math.floor(nextSched.time_start_in_minutes / 60)
              .toString()
              .padStart(2, '0')
            const openMins = (nextSched.time_start_in_minutes % 60)
              .toString()
              .padStart(2, '0')

            const dayName =
              i === 1
                ? 'Amanhã'
                : openTarget.locale('pt-br').format('dddd')

            nextEvent = {
              type: 'opens',
              title: 'Abre em',
              targetTime: openTarget.toISOString(),
              targetLabel: `${dayName} às ${openHours}:${openMins}`,
            }
            break
          }
        }
      }
    }

    // 5. Calcular Lotação Automática
    // Buscamos agendamentos que coincidam com a hora atual
    const currentHourStart = now.startOf('hour').toISOString()
    const nextHourStart = now.add(1, 'hour').startOf('hour').toISOString()

    const activeBookingsCount = await prisma.scheduling.count({
      where: {
        date: {
          gte: currentHourStart,
          lt: nextHourStart,
        },
      },
    })

    // Nível de 1 a 5 baseado na ocupação
    // 0-20% = 1, 21-40% = 2, ..., 81-100% = 5
    const occupancyRate = activeBookingsCount / MAX_CAPACITY
    const autoCapacityLevel = Math.min(
      5,
      Math.max(1, Math.ceil(occupancyRate * 5)),
    )

    return NextResponse.json({
      isOpen,
      capacityLevel: isOpen ? autoCapacityLevel : 0,
      isManualClosed: !manualIsOpen,
      nextEvent,
      debug: {
        activeBookingsCount,
        MAX_CAPACITY,
        currentMinutes,
        isWithinBusinessHours,
      },
    })
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}

import { z } from 'zod'
const updateStatusSchema = z.object({
  isOpen: z.boolean(),
})

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { isOpen } = updateStatusSchema.parse(body)

    await prisma.systemConfig.upsert({
      where: { key: CONFIG_KEYS.isOpen },
      update: { value: String(isOpen) },
      create: { key: CONFIG_KEYS.isOpen, value: String(isOpen) },
    })

    return NextResponse.json({ isOpen })
  } catch (error) {
    console.error('Error updating system status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}
