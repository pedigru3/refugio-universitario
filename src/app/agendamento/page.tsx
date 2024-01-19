'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'
import { DialogComponent } from '@/components/dialog'

import { TimePickerComponent } from './components/timer-picker'
import { TablePickerComponent } from './components/table-picker'

import { useSchedule } from '@/hooks/useSchedule'

import dayjs from 'dayjs'

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [isSending, setIsSending] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const router = useRouter()

  const {
    availability,
    availabilityTables,
    selectedDate,
    weekDay,
    hour,
    tableId,
    handleSelectTable,
    handleSelectTime,
    handleSelectedDate,
    isLoading,
  } = useSchedule()

  const isDateSelected = !!selectedDate

  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

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
