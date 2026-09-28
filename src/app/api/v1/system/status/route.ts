import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/pt-br'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('pt-br')

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

    // 2. Buscar horários de funcionamento e datas bloqueadas
    const [allSchedules, blockedDatesList] = await Promise.all([
      prisma.availableSchedule.findMany({
        orderBy: { week_day: 'asc' },
      }),
      prisma.blockedDates.findMany(),
    ])

    const blockedDatesSet = new Set(
      blockedDatesList.map((b) =>
        dayjs(b.date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      ),
    )

    const isOperatingDay = (dateObj: dayjs.Dayjs) => {
      const weekDay = dateObj.day()
      const dateStr = dateObj.format('YYYY-MM-DD')

      // 1. Está bloqueado manualmente?
      if (blockedDatesSet.has(dateStr)) {
        return { valid: false, reason: 'blocked_date' as const }
      }

      // 2. Tem horário cadastrado para este dia da semana?
      const sched = allSchedules.find((s) => s.week_day === weekDay)
      if (!sched) {
        return { valid: false, reason: 'no_schedule_weekday' as const }
      }

      // 3. Está antes do start_day?
      if (sched.start_day) {
        const startDayObj = dayjs(sched.start_day)
          .tz('America/Sao_Paulo')
          .startOf('day')
        if (dateObj.startOf('day').isBefore(startDayObj)) {
          return {
            valid: false,
            reason: 'before_start_day' as const,
            startDayObj,
          }
        }
      }

      // 4. Está depois do final_day?
      if (sched.final_day) {
        const finalDayObj = dayjs(sched.final_day)
          .tz('America/Sao_Paulo')
          .endOf('day')
        if (dateObj.startOf('day').isAfter(finalDayObj)) {
          return { valid: false, reason: 'after_final_day' as const }
        }
      }

      return { valid: true, schedule: sched }
    }

    const todayCheck = isOperatingDay(now)
    let isWithinBusinessHours = false

    if (todayCheck.valid && todayCheck.schedule) {
      isWithinBusinessHours =
        currentMinutes >= todayCheck.schedule.time_start_in_minutes &&
        currentMinutes < todayCheck.schedule.time_end_in_minutes
    }

    // 3. Status Final: Aberto se (Manual AND Horário Comercial AND Data Válida)
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
      targetLabel: 'Sem previsão de abertura',
    }

    if (isOpen && todayCheck.valid && todayCheck.schedule) {
      const closeTarget = now
        .startOf('day')
        .add(todayCheck.schedule.time_end_in_minutes, 'minute')
      const closeHours = Math.floor(
        todayCheck.schedule.time_end_in_minutes / 60,
      )
        .toString()
        .padStart(2, '0')
      const closeMins = (todayCheck.schedule.time_end_in_minutes % 60)
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
      if (
        todayCheck.valid &&
        todayCheck.schedule &&
        currentMinutes < todayCheck.schedule.time_start_in_minutes
      ) {
        const openTarget = now
          .startOf('day')
          .add(todayCheck.schedule.time_start_in_minutes, 'minute')
        const openHours = Math.floor(
          todayCheck.schedule.time_start_in_minutes / 60,
        )
          .toString()
          .padStart(2, '0')
        const openMins = (todayCheck.schedule.time_start_in_minutes % 60)
          .toString()
          .padStart(2, '0')

        nextEvent = {
          type: 'opens',
          title: 'Abre em',
          targetTime: openTarget.toISOString(),
          targetLabel: `Hoje às ${openHours}:${openMins}`,
        }
      } else if (allSchedules.length > 0) {
        // Procurar nos próximos 365 dias
        for (let i = 1; i <= 365; i++) {
          const candidateDate = now.add(i, 'day')
          const check = isOperatingDay(candidateDate)

          if (check.valid && check.schedule) {
            const openTarget = candidateDate
              .startOf('day')
              .add(check.schedule.time_start_in_minutes, 'minute')
            const openHours = Math.floor(
              check.schedule.time_start_in_minutes / 60,
            )
              .toString()
              .padStart(2, '0')
            const openMins = (check.schedule.time_start_in_minutes % 60)
              .toString()
              .padStart(2, '0')

            let targetLabel = ''
            if (i === 1) {
              targetLabel = `Amanhã às ${openHours}:${openMins}`
            } else if (i < 7) {
              const dayName = candidateDate.locale('pt-br').format('dddd')
              targetLabel = `${dayName} às ${openHours}:${openMins}`
            } else {
              const formattedDate = candidateDate
                .locale('pt-br')
                .format('D [de] MMMM')
              const dayName = candidateDate.locale('pt-br').format('dddd')
              targetLabel = `${formattedDate} (${dayName}) às ${openHours}:${openMins}`
            }

            nextEvent = {
              type: 'opens',
              title: 'Abre em',
              targetTime: openTarget.toISOString(),
              targetLabel,
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
