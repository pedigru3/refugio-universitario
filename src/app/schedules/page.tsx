'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'

import { Availability } from '@/hooks/useSchedule'

import dayjs from 'dayjs'
import { TimePickerComponent } from '../agendamento/components/timer-picker'
import { TableButton } from '@/components/table-button'
import useSWR from 'swr'
import { Button } from '@/components/button'
import { useRouter } from 'next/navigation'
import { DialogComponent } from '@/components/dialog'

interface AvailabilityTable {
  table_id: string
  table_name: string
  is_available: boolean
}

type AvailabilityTables = AvailabilityTable[]

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [availabilityTimes, setAilabilityTimes] = useState<Availability | null>(
    null,
  )

  const [isSeeding, setIsSeeding] = useState(false)

  const [tableCheckedId, setTableChecked] = useState('')
  const [startHour, selectStartHour] = useState<number | undefined>()
  const [endHour, selectEndHour] = useState<number | undefined>()

  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const router = useRouter()

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availabilityTables, isLoading: loadingTables } =
    useSWR<AvailabilityTables>(
      selectedDate ? ['availabilityTables', selectedDateWithoutTime] : null,
      async () => {
        const response = await fetch(
          `/api/v2/availability?date=${selectedDateWithoutTime}`,
        )
        const json = await response.json()
        return json.availability
      },
    )

  const { data: availabilityEndTimes, isLoading: loadingEndHours } =
    useSWR<Availability>(
      startHour
        ? ['availabilityEndHours', [tableCheckedId, selectedDate, startHour]]
        : null,
      async () => {
        const response = await fetch(
          `/api/v2/availability/end-time?id=${tableCheckedId}&date=${dayjs(
            selectedDate,
          ).format('YYYY-MM-DD')}&hour=${startHour}`,
        )
        const json = await response.json()
        return json
      },
    )

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  if (status === 'loading') {
    return <Loading />
  }

  function cleanAllData() {
    selectEndHour(undefined)
    selectStartHour(undefined)
    setTableChecked('')
    setAilabilityTimes(null)
  }

  async function handleSelectDate(date: Date) {
    cleanAllData()
    setSelectedDate(date)
  }

  async function handleSelectTable(tableId: string) {
    cleanAllData()
    setTableChecked(tableId)
    await getAvailabilityTimesFromTable(tableId)
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
        setAilabilityTimes(data)
      } else {
        console.error('Erro ao fazer a requisição:', response.statusText)
      }
    }
  }

  async function handleSendingForm() {
    setIsSeeding(true)
    if (!startHour || !endHour) {
      return setIsSeeding(false)
    }
    const body = {
      date: dayjs(selectedDate).set('hour', startHour).startOf('hour'),
      table_id: tableCheckedId,
      spent_time_in_minutes: (endHour - startHour) * 60,
    }
    try {
      const response = await fetch(
        `/api/v1/scheduling/${dataSession?.user.username}`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      )

      if (response.ok) {
        return router.push('/agendamento/success')
      } else {
        setIsAlertOpen(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Container>
      <Title color="light" type="h2">
        Agendamento
      </Title>
      <div className="max-w-[540px]">
        <div
          className={`mt-6 relative grid grid-cols-1 
       max-w-[540px] bg-zinc-800 rounded-md`}
        >
          <Calendar
            selectDate={selectedDate}
            onDateSelected={handleSelectDate}
          />
        </div>
        {availabilityTables && (
          <div className="bg-zinc-800 mt-1 rounded-md p-4">
            <p className="text-lg text-bold">
              Escolha uma mesa para o dia {selectedDate?.getDate()}:
            </p>
            <div className="flex gap-3 mt-2">
              {loadingTables ? (
                <p>loading</p>
              ) : (
                availabilityTables.map((table) => {
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
                })
              )}
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
                describeDate={`Horário de chegada`}
                handleSelectTime={async (hour) => {
                  selectStartHour(hour)
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
                describeDate={`Horário de saída`}
                handleSelectTime={(hour) => {
                  selectEndHour(hour)
                }}
                weekDay={weekDay}
              />
            </div>
          </div>
        )}
        {endHour && (
          <div className="bg-zinc-800 mt-1 rounded-md p-4 pb-5">
            <div className="items-center self-center">
              <p>Confirme sua reserva:</p>
              <p>Data: {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}</p>
              <p>
                Horário: das {startHour} às {endHour}h
              </p>
            </div>
            <div className="mt-5">
              <Button
                isLoading={isSeeding}
                onClick={handleSendingForm}
                bgColor={'gray'}
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </div>
      <DialogComponent
        isOpen={isAlertOpen}
        onOpenChange={(value) => setIsAlertOpen(value)}
        message="Ops! Algo deu errado. Verifique se já não há uma reserva sua nesse horário."
        onClose={() => setIsAlertOpen(false)}
      />
    </Container>
  )
}
