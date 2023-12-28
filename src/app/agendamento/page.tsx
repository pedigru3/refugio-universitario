'use client'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { Title } from '@/components/title'
import { TimePickerComponent } from './components/timer-picker'
import { TablePickerComponent } from './components/table-picker'
import { DialogComponent } from '@/components/dialog'

export interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export interface AvailabilityTables {
  table_id: string
  table_name: string
  isAvailable: boolean
  empty_chairs: number
  chair_count: number
}

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [isSending, setIsSending] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const router = useRouter()

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
    isTableSelected ? setTableId(tableId) : setTableId('')
  }

  async function handleSendingForm() {
    setIsSending(true)
    if (!selectedDate || !hour.current || tableId === '') {
      return setIsSending(false)
    }

    const setTime = dayjs(selectedDate)
      .set('hour', hour.current)
      .startOf('hour')
      .format()

    const body = {
      date: setTime,
      table_id: tableId,
    }

    const response = await fetch(
      `/api/v1/scheduling/${dataSession?.user.username}`,
      {
        body: JSON.stringify(body),
        method: 'POST',
      },
    )

    if (response.ok) {
      return router.push('/agendamento/success')
    } else {
      setIsAlertOpen(true)
    }

    setIsSending(false)
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
      <Title color="light" type="h2">
        Agendamento
      </Title>
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
          <TimePickerComponent
            availabilityTimes={availability}
            currentHour={hour.current}
            describeDate={describeDate}
            handleSelectTime={handleSelectTime}
            isLoading={isLoading}
            weekDay={weekDay}
          />
        )}
      </div>
      {availabilityTables && (
        <TablePickerComponent
          availabilityTables={availabilityTables}
          currentHour={hour.current}
          handleSelectTable={handleSelectTable}
          handleSendingForm={handleSendingForm}
          isSending={isSending}
          name={dataSession.user.name.split(' ', 1)[0]}
          selectedDate={selectedDate}
          tableId={tableId}
        />
      )}
      <DialogComponent
        isOpen={isAlertOpen}
        onOpenChange={(value) => setIsAlertOpen(value)}
        message="Ops! Algo deu errado. Verifique se já não há uma reserva sua nesse horário."
        onClose={() => setIsAlertOpen(false)}
      />
    </Container>
  )
}
