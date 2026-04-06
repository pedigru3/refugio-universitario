'use client'

import { Trash, PencilSimple, CheckCircle, Circle } from '@phosphor-icons/react'
import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { useEffect, useState } from 'react'
import 'dayjs/locale/pt-br'

interface Schedule {
  user: string
  name: string
  course: string
  slots: { id: string; hour: string; checkIn: string | null }[]
}

interface GroupedScheduling {
  date: string
  schedules: Schedule[]
}

interface SchedulingData {
  groupedScheduling: GroupedScheduling[]
}

export default function Schedules() {
  const [schedules, setSchedules] = useState<GroupedScheduling[]>([])
  const [maxCapacity, setMaxCapacity] = useState<number>(20)

  async function getSchedules() {
    const response = await fetch('/api/v1/scheduling')
    const schedules: SchedulingData = await response.json()

    setSchedules(schedules.groupedScheduling)
  }

  async function fetchConfig() {
    const response = await fetch('/api/v1/config')
    if (response.ok) {
      const data = await response.json()
      setMaxCapacity(data.maxCapacity)
    }
  }

  async function updateCapacity(newCapacity: number) {
    setMaxCapacity(newCapacity)
    await fetch('/api/v1/config', {
      method: 'POST',
      body: JSON.stringify({ maxCapacity: newCapacity }),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async function handleDeleteAppointment(username: string, id: string) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      await fetch(`/api/v1/scheduling/${username}/${id}`, {
        method: 'DELETE',
      })
      getSchedules()
    }
  }

  async function handleCheckIn(username: string, id: string) {
    const response = await fetch(`/api/v1/scheduling/${username}/${id}/check-in`, {
      method: 'PATCH',
    })
    if (response.ok) {
      getSchedules()
    }
  }

  useEffect(() => {
    getSchedules()
    fetchConfig()
  }, [])

  return (
    <div className="mt-10 pb-10">
      <Container>
        <div className="flex justify-between items-center">
          <Title type="h2" color="light">
            Agendamentos
          </Title>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
             <span className="text-sm font-medium text-zinc-400">Limite de Pessoas:</span>
             <input
               type="number"
               value={maxCapacity}
               onChange={(e) => updateCapacity(Number(e.target.value))}
               className="w-16 bg-white border border-white/20 rounded-lg px-2 py-1 text-center text-black"
             />
          </div>
        </div>
        <div>
          {schedules.length === 0 && (
            <p className="mt-5">
              Ainda não temos agendamentos... Tudo tranquilo por aqui.
            </p>
          )}
           {schedules.map((item: GroupedScheduling) => {
            return (
              <table
                key={item.date}
                className="mt-5 w-full text-left max-w-xl border-separate border-spacing-y-1"
              >
                <thead>
                  <tr>
                    <th className="bg-orange-400 p-2 text-lg text-white rounded-t-lg">{item.date}</th>
                  </tr>
                </thead>
                <tbody className="">
                  {item.schedules.map((schedule: Schedule) => {
                    return (
                      <tr
                        key={schedule.user}
                        className="bg-white/90 shadow-sm text-zinc-900 border border-white/10"
                      >
                        <td className="p-4">
                          <p className="font-bold text-lg">
                            {schedule.name}
                          </p>
                          <div className="">
                            <p className="text-sm text-zinc-500">
                              <b>Curso: </b>
                              {schedule.course}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {schedule.slots.map((slot) => {
                              const isCheckedIn = !!slot.checkIn

                              return (
                                <div 
                                  key={slot.id} 
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition duration-200 ${
                                    isCheckedIn 
                                      ? 'bg-emerald-50 border-emerald-200' 
                                      : 'bg-zinc-50 border-zinc-200'
                                  }`}
                                >
                                   <span className={`font-bold ${isCheckedIn ? 'text-emerald-700' : 'text-zinc-900'}`}>
                                    {slot.hour}h
                                   </span>
                                   
                                   <div className="h-4 w-[1px] bg-zinc-300 mx-1" />

                                   <button
                                     onClick={() => handleCheckIn(schedule.user, slot.id)}
                                     className={`p-0.5 rounded-full transition ${
                                       isCheckedIn 
                                         ? 'text-emerald-600 hover:bg-emerald-100' 
                                         : 'text-zinc-400 hover:bg-zinc-200'
                                     }`}
                                     title={isCheckedIn ? 'Desmarcar Presença' : 'Marcar Presença'}
                                   >
                                     {isCheckedIn ? (
                                       <CheckCircle size={20} weight="fill" />
                                     ) : (
                                       <Circle size={20} />
                                     )}
                                   </button>

                                   <button
                                     onClick={() => window.location.href = `/agendamento?username=${schedule.user}&edit=${slot.id}`}
                                     className="text-purple-500 hover:text-purple-700 p-0.5 hover:bg-purple-50 rounded transition"
                                     title="Editar"
                                    >
                                      <PencilSimple size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAppointment(schedule.user, slot.id)}
                                      className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-50 rounded transition"
                                      title="Excluir"
                                    >
                                      <Trash size={18} />
                                    </button>
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
