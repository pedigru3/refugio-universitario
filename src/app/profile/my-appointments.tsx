'use client'

import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import { CloseButton } from './close-button'
import { Loading } from '@/components/loading'
import { useState } from 'react'

type Appointments = {
  id: string
  table: {
    table_name: string
  }
  date: string
}[]

export function MyAppointments() {
  const session = useSession()
  const [reloading, setReloading] = useState(false)

  const {
    data: appointments,
    isLoading,
    mutate,
  } = useSWR<Appointments>(
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

  async function handleCloseButton(wasConfirmed: boolean, id: string) {
    if (wasConfirmed) {
      setReloading(true)
      await fetch(`/api/v1/scheduling/${session.data?.user.username}/${id}`, {
        method: 'DELETE',
      })
      await mutate()
      setReloading(false)
    }
  }

  if (isLoading || reloading) {
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
