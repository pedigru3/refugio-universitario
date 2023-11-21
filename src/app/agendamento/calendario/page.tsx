'use client'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { TimePickerItem } from '@/components/time-picker-item'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const avaliableHours = useRef([])

  const isDateSelected = !!selectedDate
  const isTimeSelected = true

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  async function handleSelectedDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const responseTime = await fetch(
      `/api/v1/availability?date=${year}-${month}-${day}`,
    )
    const timeData = await responseTime.json()
    avaliableHours.current = timeData.availability
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
              {avaliableHours.current.map((time) => {
                return (
                  <TimePickerItem key={time}>{`${time}:00`}</TimePickerItem>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {isTimeSelected && (
        <div className="bg-zinc-800 mt-5 rounded-md box-border max-w-[540px] lg:max-w-[800px]">
          <p className="mx-5 pt-5">Reserve seu lugar:</p>
          <div className="flex items-center justify-center"></div>
        </div>
      )}
    </Container>
  )
}
