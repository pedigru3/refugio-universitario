'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'
import { DialogComponent } from '@/components/dialog'

import { TimePickerComponent } from './components/timer-picker'
import { Button } from '@/components/button'

import { useSchedule } from '@/hooks/useSchedule'

import dayjs from 'dayjs'

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [isSending, setIsSending] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const router = useRouter()

  const {
    availability,
    selectedDate,
    weekDay,
    hour,
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
    if (!selectedDate || hour.current === undefined) {
      return setIsSending(false)
    }

    const setTime = dayjs(selectedDate)
      .set('hour', hour.current)
      .startOf('hour')
      .format()

    const body = {
      date: setTime,
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
            currentHour={hour.current ?? null}
            describeDate={describeDate}
            handleSelectTime={handleSelectTime}
            isLoading={isLoading}
            weekDay={weekDay}
          />
        )}
      </div>

      {hour.current !== undefined && (
        <div className="mt-6 bg-zinc-800 border border-zinc-700 p-6 rounded-md max-w-[540px] lg:max-w-[820px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
            <div className="items-center self-center text-white">
              <p className="text-zinc-400">
                {dataSession?.user.name.split(' ', 1)[0]}, confirme sua reserva:
              </p>
              <div className="mt-2">
                <p className="font-bold">
                  Data: {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}
                </p>
                <p className="font-bold">Horário: {hour.current} horas</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                isLoading={isSending}
                onClick={handleSendingForm}
                bgColor={'gray'}
                className="w-full lg:w-auto px-8"
              >
                Confirmar Reserva
              </Button>
            </div>
          </div>
        </div>
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
