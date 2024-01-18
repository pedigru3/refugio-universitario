'use client'

import '@/lib/dayjs'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { CalendarActions } from './calendar-actions'
import { CalendarContainer } from './calendar-container'
import { CalendarHeader } from './calendar-header'
import { CalendarTitle } from './calendar-title'
import { CalendarBody } from './calendar-body'
import { getWeekDays } from '@/utils/get-week-days'
import { CalendarDay } from './calendar-day'
import dayjs from 'dayjs'
import { useCalendar } from '@/hooks/useCalendar'

interface CalendarProps {
  selectDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectDate, onDateSelected }: CalendarProps) {
  const {
    calendarWeeks,
    currentDate,
    currentMonth,
    currentYear,
    handleNextMonth,
    handlePreviousMonth,
    isLoading,
  } = useCalendar()

  const shortWeekDays = getWeekDays({ short: true })

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
