'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import * as Dialog from '@radix-ui/react-dialog'
import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'
import { DialogComponent } from '@/components/dialog'
import { CalendarBlank, Info, X } from '@phosphor-icons/react'

import { TimePickerComponent } from './components/timer-picker'
import { Button } from '@/components/button'

import { useSchedule } from '@/hooks/useSchedule'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const searchParams = useSearchParams()
  const targetUsername = searchParams.get('username')
  const editId = searchParams.get('edit')
  const isAdmin = dataSession?.user.role === 'admin'
  const finalUsername = (isAdmin && targetUsername) ? targetUsername : dataSession?.user.username

  const [isSending, setIsSending] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [hasDismissedOpeningModal, setHasDismissedOpeningModal] = useState(false)

  const router = useRouter()

  const {
    availability,
    selectedDate,
    weekDay,
    startHour,
    endHour,
    availableEndTimes,
    handleSelectTime,
    handleSelectEndTime,
    handleSelectedDate,
    isLoading,
  } = useSchedule()

  const isDateSelected = !!selectedDate

  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  async function handleSendingForm() {
    setIsSending(true)
    const setTime = dayjs(selectedDate)
      .set('hour', startHour!)
      .startOf('hour')
      .format()

    const body = {
      date: setTime,
      spent_time_in_minutes: (endHour! - startHour!) * 60,
    }

    const url = editId 
      ? `/api/v1/scheduling/${finalUsername}/${editId}`
      : `/api/v1/scheduling/${finalUsername}`

    const response = await fetch(
      url,
      {
        body: JSON.stringify(body),
        method: editId ? 'PATCH' : 'POST',
      },
    )

    if (response.ok) {
      return router.push('/agendamento/success')
    } else {
      setIsAlertOpen(true)
    }

    setIsSending(false)
  }

  const { data: systemStatus } = useSWR('/api/v1/system/status', async (url) => {
    const res = await fetch(url)
    return res.json()
  })

  const nextOpeningTarget = systemStatus?.nextEvent?.targetTime
    ? dayjs(systemStatus.nextEvent.targetTime).locale('pt-br')
    : null

  const isLongTermClosed =
    !systemStatus?.isOpen &&
    nextOpeningTarget &&
    nextOpeningTarget.diff(dayjs(), 'day') >= 3

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <Container>
      <Title color="light" type="h2">
        {editId ? 'Editar Agendamento' : 'Agendamento'}
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
          <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[440px] scrollbar-thin scrollbar-thumb-zinc-600">
            <TimePickerComponent
              availabilityTimes={availability}
              currentHour={startHour ?? null}
              describeDate="Horário de chegada"
              handleSelectTime={handleSelectTime}
              isLoading={isLoading}
              weekDay={weekDay}
            />

            {startHour !== undefined && (
              <TimePickerComponent
                availabilityTimes={{
                  possibleTimes: availableEndTimes,
                  availableTimes: availableEndTimes,
                }}
                currentHour={endHour ?? null}
                describeDate="Horário de saída"
                handleSelectTime={handleSelectEndTime}
                isLoading={isLoading}
                weekDay={weekDay}
              />
            )}
          </div>
        )}
      </div>

      {startHour !== undefined && endHour !== undefined && (
        <div className="mt-6 bg-zinc-800 border border-zinc-700 p-6 rounded-md max-w-[540px] lg:max-w-[820px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
            <div className="items-center self-center text-white">
              <p className="text-zinc-400">
                {editId ? (
                  <>Editando agendamento de <span className="text-emerald-400 font-bold">{finalUsername}</span>, confirme a alteração:</>
                ) : isAdmin && targetUsername ? (
                  <>Agendando para <span className="text-emerald-400 font-bold">{targetUsername}</span>, confirme a reserva:</>
                ) : (
                  <>{dataSession?.user.name.split(' ', 1)[0]}, confirme sua reserva:</>
                )}
              </p>
              <div className="mt-2">
                <p className="font-bold">
                  Data: {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}
                </p>
                <p className="font-bold">Horário: das {startHour}:00 às {endHour}:00</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                isLoading={isSending}
                onClick={handleSendingForm}
                bgColor={'gray'}
                className="w-full lg:w-auto px-8"
              >
                {editId ? 'Confirmar Alteração' : 'Confirmar Reserva'}
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

      <Dialog.Root
        open={Boolean(isLongTermClosed && !hasDismissedOpeningModal)}
        onOpenChange={(open) => {
          if (!open) setHasDismissedOpeningModal(true)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Content className=" max-w-[440px] bg-zinc-900 border border-purple-500/40 shadow-[0_10px_40px_-10px_rgba(119,5,247,0.35)] rounded-2xl p-6 sm:p-8 text-white focus:outline-none relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-5 shadow-lg shadow-purple-950/40">
                  <CalendarBlank size={36} weight="duotone" />
                </div>

                <Dialog.Title className="text-2xl font-bold text-white mb-2">
                  Aviso de Funcionamento
                </Dialog.Title>

                <div className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 my-4 text-center shadow-inner">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    Agendamentos disponíveis apenas para:
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-white mt-1 font-sans">
                    {nextOpeningTarget?.format('D [de] MMMM')}
                  </p>
                  <p className="text-xs text-purple-200/90 mt-1 font-medium">
                    {nextOpeningTarget
                      ? `${
                          nextOpeningTarget.format('dddd').charAt(0).toUpperCase() +
                          nextOpeningTarget.format('dddd').slice(1)
                        } às ${nextOpeningTarget.format('HH:mm')}`
                      : ''}
                  </p>
                </div>

                <Dialog.Description className="text-sm text-zinc-300 leading-relaxed mb-4 mt-1">
                  Você pode antecipar seus agendamentos selecionando no calendário datas a partir do dia de reabertura.
                </Dialog.Description>

                <button
                  type="button"
                  onClick={() => setHasDismissedOpeningModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-purple-950/50 cursor-pointer"
                >
                  Ok
                </button>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={() => setHasDismissedOpeningModal(true)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </Container>
  )
}
