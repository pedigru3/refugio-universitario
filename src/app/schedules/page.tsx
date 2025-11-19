'use client'

import { useSession } from 'next-auth/react'
import { useContext, useState } from 'react'
import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { Loading } from '@/components/loading'
import { Title } from '@/components/title'
import dayjs from 'dayjs'
import { Button } from '@/components/button'
import { useRouter } from 'next/navigation'
import { DialogComponent } from '@/components/dialog'
import { TablePickerComponent } from './components/table-picker'
import { ScheduleContext } from '@/context/schedule-provider'
import { TimeStartPicker } from './components/time-start-picker'
import { TimeEndPicker } from './components/time-end-picker'

export default function Agendamento() {
  const { status, data: dataSession } = useSession({ required: true })
  const [isSeeding, setIsSeeding] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const {
    selectedDate,
    startHour,
    endHour,
    tableCheckedId,
    changeSelectedDate,
  } = useContext(ScheduleContext)

  const router = useRouter()

  if (status === 'loading') {
    return <Loading />
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
            onDateSelected={changeSelectedDate}
          />
        </div>
        <TablePickerComponent />
        <TimeStartPicker />
        <TimeEndPicker />
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
