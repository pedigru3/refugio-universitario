'use client'

import '@/lib/dayjs'
import useSWR from 'swr'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { CalendarActions } from './calendar-actions'
import { CalendarContainer } from './calendar-container'
import { CalendarHeader } from './calendar-header'
import { CalendarTitle } from './calendar-title'
import { CalendarBody } from './calendar-body'
import { getWeekDays } from '@/utils/get-week-days'
import { CalendarDay } from './calendar-day'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

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

interface CalendarProps {
  selectDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  function handlePreviousMonth() {
    setCurrentDate((date) => date.subtract(1, 'M'))
  }

  function handleNextMonth() {
    setCurrentDate((date) => date.add(1, 'M'))
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

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

  console.log(blockedDates?.startDay)

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
        return {
          date,
          disabled:
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

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span className="text-gray-400">{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            disabled={currentDate
              .subtract(1, 'M')
              .isBefore(dayjs(new Date()).startOf('M'))}
            title="Mês anterior"
            className="enabled:cursor-pointer disabled:opacity-40 leading-[0] rounded-sm hover:enabled:text-gray-200 focus:shadow-sm"
            onClick={handlePreviousMonth}
          >
            <CaretLeft className="w-5 h-5" />
          </button>
          <button
            title="Próximo mês"
            className="cursor-pointer leading-[0] rounded-sm hover:text-gray-200 focus:shadow-sm"
            onClick={handleNextMonth}
          >
            <CaretRight className="w-5 h-5" />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr className="mb-2">
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody className=" before:leading-3 before:content-['.'] before:block before:text-gray-800">
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => {
              return (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((_, index) => {
                    return (
                      <td key={index}>
                        <div className="w-full aspect-square bg-gray-600 rounded-md animate-pulse"></div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        isChecked={
                          date.format('MM-DD') ===
                          dayjs(selectDate).format('MM-DD')
                        }
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
