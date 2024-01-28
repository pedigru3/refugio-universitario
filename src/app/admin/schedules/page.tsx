'use client'

import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { useEffect, useState } from 'react'

interface Schedule {
  user: string
  name: string
  table: string
  hours: string[]
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

  async function getSchedules() {
    const response = await fetch('/api/v1/scheduling')
    const schedules: SchedulingData = await response.json()

    setSchedules(schedules.groupedScheduling)
  }

  useEffect(() => {
    getSchedules()
  }, [])

  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">
          Agendamentos
        </Title>
        <div>
          {schedules.length === 0 && (
            <p className="mt-5">
              Ainda não temos agendamentos... Tudo tranquilo por aqui.
            </p>
          )}
          {schedules.map((item) => {
            return (
              <table
                key={item.date}
                className="mt-5 w-full text-left max-w-md border-separate border-spacing-y-1"
              >
                <thead>
                  <th className="bg-orange-400  p-2 text-lg">{item.date}</th>
                </thead>
                <tbody className="">
                  {item.schedules.map((schedule) => {
                    return (
                      <tr
                        key={schedule.user}
                        className="bg-white opacity-80 shadow-sm text-blue-800 p-2 "
                      >
                        <p className="px-2 pt-2 font-bold">
                          {schedule.name} - {schedule.table}
                        </p>
                        <p className="px-2"></p>
                        <div className="flex gap-2">
                          <p className="px-2 pt-1">
                            <b>Horário:</b>
                            {schedule.hours.map((hour) => {
                              return (
                                <span className="p-2" key={hour}>
                                  {hour}
                                </span>
                              )
                            })}
                          </p>
                        </div>
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
