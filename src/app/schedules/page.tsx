'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'
import { DialogComponent } from '@/components/dialog'

import { Availability } from '@/hooks/useSchedule'

import dayjs from 'dayjs'
import { TimePickerComponent } from '../agendamento/components/timer-picker'
import { Button } from '@/components/button'
import { TableButton } from '@/components/table-button'

interface AvailabilityTable {
  table_id: string
  table_name: string
  is_available: boolean
}

type AvailabilityTables = AvailabilityTable[]

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [availabilityTables, setavailabilityTables] = useState<
    AvailabilityTable[] | null
  >(null)

  const [availabilityTimes, setAilabilityTimes] = useState<Availability | null>(
    null,
  )

  const [availabilityEndTimes, setAilabilityEndTimes] =
    useState<Availability | null>(null)

  const [startHour, selectStartHour] = useState<number | undefined>()
  const [endHour, selectEndHour] = useState<number | undefined>()

  const [tableCheckedId, setTableChecked] = useState('')

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  // const router = useRouter()

  if (status === 'loading') {
    return <Loading />
  }

  async function handleSelectDate(date: Date) {
    console.log('clique')
    setSelectedDate(date)
    await getAvailabilityTables(date)
  }

  async function handleSelectTable(tableId: string) {
    setTableChecked(tableId)
    console.log(tableId)
    await getAvailabilityTimesFromTable(tableId)
  }

  async function getAvailabilityTables(date: Date) {
    const response = await fetch(
      `/api/v2/availability?date=${dayjs(date).format('YYYY-MM-DD')}`,
    )
    if (response.ok) {
      const { availability } = await response.json()
      setavailabilityTables(availability)
    }
  }

  async function getAvailabilityTimesFromTable(id: string) {
    if (selectedDate) {
      const response = await fetch(
        `/api/v2/availability/table?id=${id}&date=${dayjs(selectedDate).format(
          'YYYY-MM-DD',
        )}`,
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setAilabilityTimes(data)
      } else {
        console.error('Erro ao fazer a requisição:', response.statusText)
      }
    }
  }

  async function getEndTime() {
    if (selectedDate) {
      const response = await fetch(
        `/api/v2/availability/end-time?id=${tableCheckedId}&date=${dayjs(
          selectedDate,
        ).format('YYYY-MM-DD')}&hour=${startHour}`,
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setAilabilityEndTimes(data)
      } else {
        console.error('Erro ao fazer a requisição:', response.statusText)
      }
    }
  }

  return (
    <Container>
      <Title color="light" type="h2">
        Agendamento
      </Title>
      <div
        className={`mt-6 relative grid grid-cols-1 lg:max-w-[540px]
       max-w-[540px] bg-zinc-800 rounded-md`}
      >
        <Calendar selectDate={selectedDate} onDateSelected={handleSelectDate} />
      </div>
      {availabilityTables && (
        <div className="bg-zinc-800 mt-1 rounded-md p-4">
          <p className="text-lg text-bold">
            Escolha uma mesa para o dia {selectedDate?.getDate()}:
          </p>
          <div className="flex gap-3 mt-2">
            {availabilityTables.map((table) => {
              return (
                <TableButton
                  key={table.table_id}
                  chairCount={0}
                  emptyChairs={0}
                  isAvailable={table.is_available}
                  isChecked={table.table_id === tableCheckedId}
                  tableName={table.table_name}
                  onSelectedTable={() => {
                    handleSelectTable(table.table_id)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
      {availabilityTimes && (
        <div className="bg-zinc-800 mt-1 rounded-md p-2 pb-5">
          <div className="flex gap-3">
            <TimePickerComponent
              isLoading={false}
              availabilityTimes={availabilityTimes}
              currentHour={startHour}
              describeDate={`Que horas você chega?
               Vamos preparar um café para você.`}
              handleSelectTime={async (hour) => {
                selectStartHour(hour)
                await getEndTime()
              }}
              weekDay={weekDay}
            />
          </div>
        </div>
      )}
      {availabilityEndTimes && (
        <div className="bg-zinc-800 mt-1 rounded-md p-2 pb-5">
          <div className="flex gap-3">
            <TimePickerComponent
              isLoading={false}
              availabilityTimes={availabilityEndTimes}
              currentHour={endHour}
              describeDate={`Até que horas pretende ficar?`}
              handleSelectTime={(hour) => {
                selectEndHour(hour)
              }}
              weekDay={weekDay}
            />
          </div>
        </div>
      )}
    </Container>
  )
}
