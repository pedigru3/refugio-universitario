import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

interface CalendarWeek {
  week: number
  days: Array<{ date: dayjs.Dayjs; disabled: boolean }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
  lastDay: string
  startDay: string
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  function handlePreviousMonth() {
    setCurrentDate((date) => date.subtract(1, 'M'))
  }

  function handleNextMonth() {
    setCurrentDate((date) => date.add(1, 'M'))
  }

  const { data: blockedDates, isLoading } = useSWR<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const year = currentDate.get('year')
      const month = currentDate.get('month') + 1
      const response = await fetch(
        `/api/v1/blocked-dates?year=${year}&month=${month}`,
      )

      const json = await response.json()
      return json
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = currentDate
      .set('date', currentDate.daysInMonth())
      .get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        const theCurrentTimeHasPassed =
          date.startOf('h').add(1).isAfter(dayjs(new Date()).set('hour', 18)) &&
          date.endOf('day').isBefore(dayjs(new Date()).add(1, 'day'))
        return {
          date,
          disabled:
            theCurrentTimeHasPassed ||
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')) ||
            date
              .startOf('day')
              .isAfter(
                dayjs(blockedDates.lastDay).endOf('day').add(1, 'day'),
              ) ||
            date.endOf('day').isBefore(dayjs(blockedDates.startDay)),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0
        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return {
    currentDate,
    currentMonth,
    currentYear,
    isLoading,
    calendarWeeks,
    handlePreviousMonth,
    handleNextMonth,
  }
}
