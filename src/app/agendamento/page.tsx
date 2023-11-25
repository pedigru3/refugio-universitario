'use client'

import { Button } from '@/components/button'
import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { TableButton } from '@/components/table-button'
import { TimePickerItem } from '@/components/time-picker-item'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import useSWR from 'swr'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface AvailabilityTables {
  table_id: string
  table_name: string
  isAvailable: boolean
  empty_chairs: number
  chair_count: number
}

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availabilityTables, setAvailabilityTables] = useState<
    AvailabilityTables[] | null
  >(null)

  const [tableId, setTableId] = useState<string>('')
  const hour = useRef<number>()

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  async function handleSelectedDate(date: Date) {
    setSelectedDate(date)
    setAvailabilityTables(null)
    setTableId('')
    hour.current = undefined
  }

  async function handleSelectTime(time: number) {
    hour.current = time
    const dateWithTime = dayjs(selectedDate).set('hour', time).startOf('hour')
    const dateFormated = dateWithTime.format('YYYY-MM-DD')
    const response = await fetch(
      `/api/v1/availability/table?date=${dateFormated}&hour=${time}`,
    )
    const data = await response.json()
    const availabilityTables: AvailabilityTables[] = data.availability
    setAvailabilityTables(availabilityTables)
    setTableId('')
  }

  function handleSelectTable(isTableSelected: boolean, tableId: string) {
    console.log(isTableSelected)
    console.log('oi')
    isTableSelected ? setTableId(tableId) : setTableId('')
  }

  async function handleSendingForm() {
    console.log({
      user: dataSession?.user,
    })
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

  if (status === 'loading') {
    return <Loading />
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
              {availability?.possibleTimes.map((time) => {
                return (
                  <TimePickerItem
                    onClick={() => handleSelectTime(time)}
                    isChecked={time === hour.current}
                    key={time}
                    disabled={!availability.availableTimes.includes(time)}
                  >
                    {String(time).padStart(2, '0')}:00h
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
      {availabilityTables && (
        <div className="bg-zinc-800 border-t border-zinc-400 rounded-md rounded-t-none box-border max-w-[540px] lg:max-w-[800px]">
          <div className="mx-5 pt-5 pb-5">
            Reserve seu lugar das{' '}
            <span className="font-bold">{hour.current} horas:</span>
            <div className="flex gap-2 mt-2 mb-2">
              {availabilityTables.map((table) => {
                return (
                  <TableButton
                    key={
                      table.table_id + table.chair_count + table.empty_chairs
                    }
                    chairCount={table.chair_count}
                    emptyChairs={table.empty_chairs}
                    isAvailable={table.isAvailable}
                    tableName={table.table_name}
                    isChecked={tableId === table.table_id}
                    onSelectedTable={(isTableSelected) =>
                      handleSelectTable(isTableSelected, table.table_id)
                    }
                  />
                )
              })}
            </div>
          </div>
          {tableId.length > 0 && (
            <div className="px-6 pb-6 w-full border-t">
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
                <div className="items-center self-center">
                  <p>
                    {dataSession.user?.name?.split(' ', 1)}, confirme o
                    agendamento:
                  </p>
                  <p>Data: {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}</p>
                  <p>Horário: {hour.current} horas</p>
                </div>
                <div className="-mt-5">
                  <Button onClick={handleSendingForm} bgColor={'gray'}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}
