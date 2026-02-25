'use client'

import useSWR, { useSWRConfig } from 'swr'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { Calendar } from '@phosphor-icons/react'
import { CloseButton } from './close-button'
import { Loading } from '@/components/loading'
import { Appointment } from '@/models/appointment'

dayjs.locale('pt-br')

type Appointments = Appointment[]

export function MyAppointments() {
  const session = useSession()
  const { mutate } = useSWRConfig()

  const { data: appointments, isLoading } = useSWR<Appointments>(
    ['scheduling', session.data?.user.username],
    fetchAppointments,
  )

  async function fetchAppointments() {
    const response = await fetch(
      `/api/v1/scheduling/${session.data?.user.username}`,
    )
    const json = await response.json()
    return json.appointments
  }

  async function deleteAppointment(id: string) {
    await fetch(`/api/v1/scheduling/${session.data?.user.username}/${id}`, {
      method: 'DELETE',
    })
    const response = await fetch(
      `/api/v1/scheduling/${session.data?.user.username}`,
    )
    const json = await response.json()
    return json.appointments
  }

  async function handleCloseButton(wasConfirmed: boolean, id: string) {
    if (wasConfirmed) {
      const appointment = appointments?.filter(
        (appointment) => appointment.id !== id,
      )
      const options = {
        optimisticData: appointment,
        rollbackOnError(error: any) {
          // If it's timeout abort error, don't rollback
          return error.name !== 'AbortError'
        },
      }
      mutate(
        ['scheduling', session.data?.user.username],
        deleteAppointment(id),
        options,
      )
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!appointments) {
    return <div>no appointments</div>
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
        <p className="text-zinc-400">
          Você não tem nenhum agendamento ainda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const dateAppointment = dayjs(appointment.date)
        return (
          <div
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20"
            key={appointment.date}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg border border-purple-400/30 bg-purple-500/10 p-3">
                <Calendar size={20} weight="bold" className="text-purple-200" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {dateAppointment.format('DD [de] MMMM [de] YYYY')}
                </p>
                <p className="text-sm text-zinc-400">
                  {dateAppointment.format('HH:mm')} • {appointment.table.table_name}
                </p>
              </div>
            </div>
            <CloseButton
              onClick={(value) => handleCloseButton(value, appointment.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
