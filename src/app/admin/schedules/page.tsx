'use client'

import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { useEffect, useState } from 'react'

interface Schedule {
  user: string
  name: string
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
          {schedules.map((item) => {
            return (
              <div key={item.date}>
                <p>{item.date}</p>
                {item.schedules.map((schedule) => {
                  return (
                    <div key={schedule.user} className="">
                      <p>{schedule.name}</p>
                      <div className="flex gap-2">
                        {schedule.hours.map((hour) => {
                          return (
                            <div className="bg-orange-400 p-2" key={hour}>
                              {hour}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
