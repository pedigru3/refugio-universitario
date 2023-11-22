'use client'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { TimePickerItem } from '@/components/time-picker-item'
import dayjs from 'dayjs'
import { useState } from 'react'
import useSWR from 'swr'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const isTimeSelected = false

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  async function handleSelectedDate(date: Date) {
    setSelectedDate(date)
  }

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability, isLoading } = useSWR<Availability>(
    selectedDate ? ['availability', selectedDateWithoutTime] : null,
    async () => {
      const response = await fetch(
        `/api/v1/availability?date=${selectedDateWithoutTime}`,
      )

      const json = await response.json()

      return json
    },
  )

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
              {availability?.possibleTimes.map((hour) => {
                return (
                  <TimePickerItem
                    key={hour}
                    disabled={!availability.availableTimes.includes(hour)}
                  >
                    {String(hour).padStart(2, '0')}:00h
                  </TimePickerItem>
                )
              })}
              {isLoading &&
                Array.from({ length: 8 }, (_, index) => (
                  <button
                    className="h-9 w-full bg-gray-600 rounded-lg"
                    key={index}
                  >
                    Loading...
                  </button>
                ))}
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
