'use client'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { TableIcon } from '@/components/table-icon'
import { TimePickerItem } from '@/components/time-picker-item'
import dayjs from 'dayjs'
import { useState } from 'react'

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const isTimeSelected = false

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  function handleSelectedDate(date: Date) {
    setSelectedDate(date)
  }

  return (
    <Container>
      <div
        className={`mt-6 relative grid grid-cols-1 lg:max-w-[540px]
       max-w-[540px] bg-zinc-800 rounded-md ${
         isDateSelected && 'lg:grid-cols-calendar lg:max-w-[820px]'
       }`}
      >
        <Calendar
          selectDate={selectedDate}
          onDateSelected={handleSelectedDate}
        />
        {isDateSelected && (
          <div
            id="TimePicker"
            className="lg:absolute lg:right-0 lg:top-0 lg:bottom-0 text-white border-t lg:border-l border-solid
             border-gray-600 pt-6 px-6 lg:overflow-y-scroll lg:w-[280px]"
          >
            <div id="TimePickerHeader">
              {weekDay} <span className="text-gray-400"> {describeDate} </span>
            </div>

            <div
              id="TimePickerList"
              className="mt-3 grid grid-cols-2 lg:grid-cols-1 gap-2
              last:mb-6
              "
            >
              <TimePickerItem>08:00</TimePickerItem>
              <TimePickerItem>09:00</TimePickerItem>
              <TimePickerItem>10:00</TimePickerItem>
              <TimePickerItem>11:00</TimePickerItem>
              <TimePickerItem>12:00</TimePickerItem>
              <TimePickerItem>13:00</TimePickerItem>
              <TimePickerItem>14:00</TimePickerItem>
              <TimePickerItem>15:00</TimePickerItem>
              <TimePickerItem>16:00</TimePickerItem>
              <TimePickerItem>17:00</TimePickerItem>
              <TimePickerItem>18:00</TimePickerItem>
            </div>
          </div>
        )}
      </div>
      {isTimeSelected && (
        <div className="bg-zinc-800 mt-5 rounded-md box-border max-w-[540px] lg:max-w-[800px]">
          <p className="mx-5 pt-5">Reserve seu lugar:</p>
          <div className="flex items-center justify-center">
            <TableIcon />
          </div>
        </div>
      )}
    </Container>
  )
}
