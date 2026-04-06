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

    // 2. Buscar horários de funcionamento para hoje
    const schedule = await prisma.availableSchedule.findFirst({
      where: { week_day: currentWeekDay },
    })

    let isWithinBusinessHours = false
    if (schedule) {
      isWithinBusinessHours =
        currentMinutes >= schedule.time_start_in_minutes &&
        currentMinutes < schedule.time_end_in_minutes
    }

    // 3. Status Final: Aberto se (Manual AND Horário Comercial)
    const isOpen = manualIsOpen && isWithinBusinessHours

    // 4. Calcular Lotação Automática
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
