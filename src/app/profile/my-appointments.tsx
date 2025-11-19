'use client'

import useSWR, { useSWRConfig } from 'swr'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { CloseButton } from './close-button'
import { Loading } from '@/components/loading'
import { Appointment } from '@/models/appointment'

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
      <div className="mt-10">
        <p>Você não tem nenhum agendamento ainda</p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      {appointments.map((appointment) => {
        const dateAppointment = dayjs(appointment.date)
        return (
          <div
            className="w-full bg-white shadow-lg px-5 py-5 mb-3 rounded-md flex
            justify-between items-center"
            key={appointment.date}
          >
            <div>
              <p className="text-black">
                {dateAppointment.format('DD/MM/YYYY')} às{' '}
                {dateAppointment.format('HH')} horas
              </p>
              <p className="text-black">{appointment.table.table_name}</p>
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
