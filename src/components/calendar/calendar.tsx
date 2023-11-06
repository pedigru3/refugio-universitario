'use client'

import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { CalendarActions } from './calendar-actions'
import { CalendarContainer } from './calendar-container'
import { CalendarHeader } from './calendar-header'
import { CalendarTitle } from './calendar-title'
import { CalendarBody } from './calendar-body'
import { getWeekDays } from '@/utils/get-week-days'
import { CalendarDay } from './calendar-day'

export function Calendar() {
  const shortWeekDays = getWeekDays({ short: true })

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          Dezembro <span className="text-gray-400">2022</span>
        </CalendarTitle>

        <CalendarActions>
          <button className="cursor-pointer leading-[0] rounded-sm hover:text-gray-200 focus:shadow-sm">
            <CaretLeft className="w-5 h-5" />
          </button>
          <button className="cursor-pointer leading-[0] rounded-sm hover:text-gray-200 focus:shadow-sm">
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay disabled>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
          <tr>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
