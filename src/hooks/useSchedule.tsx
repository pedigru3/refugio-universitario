import dayjs from 'dayjs'
import { useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

export interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export interface AvailabilityTables {
  table_id: string
  table_name: string
  isAvailable: boolean
  empty_chairs: number
  chair_count: number
}

export function useSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const [startHour, setStartHour] = useState<number | undefined>(undefined)
  const [endHour, setEndHour] = useState<number | undefined>(undefined)

  // tables

  const [availabilityTables, setAvailabilityTables] = useState<
    AvailabilityTables[] | null
  >(null)

  // ver como receberá esse availabilityTime
  const [tableId, setTableId] = useState<string>('')

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability, isLoading } = useSWR<Availability>(
    selectedDate ? ['availability', selectedDateWithoutTime] : null,
    async () => {
      const response = await fetch(
        `/api/v1/availability?date=${selectedDateWithoutTime}`,
      )
      const json = await response.json()
      return json
    },
  )

  const availabilityTimes = availability?.availableTimes

  // Calcula os horários de saída disponíveis com base no horário de entrada
  const availableEndTimes = useMemo(() => {
    if (startHour === undefined || !availabilityTimes) return []
    
    const ends = []
    let current = startHour
    
    // O primeiro horário de saída possível é startHour + 1
    // Continuamos enquanto o próximo slot estiver disponível
    while (availabilityTimes.includes(current)) {
      ends.push(current + 1)
      current++
      // Se o próximo slot não estiver nos horários possíveis, paramos
      if (!availability?.possibleTimes.includes(current)) break
    }
    
    return ends
  }, [startHour, availabilityTimes, availability?.possibleTimes])

  async function handleSelectedDate(date: Date) {
    setSelectedDate(date)
    setAvailabilityTables(null)
    setTableId('')
    setStartHour(undefined)
    setEndHour(undefined)
  }

  async function handleSelectTime(time: number) {
    setStartHour(time)
    setEndHour(undefined)
    // Force re-render to show the confirmation section
    setTableId(String(time))
  }

  async function handleSelectEndTime(time: number) {
    setEndHour(time)
  }

  function handleSelectTable(isTableSelected: boolean, tableId: string) {
    isTableSelected ? setTableId(tableId) : setTableId('')
  }

  return {
    availability,
    availabilityTables,
    selectedDate,
    startHour,
    endHour,
    availableEndTimes,
    weekDay,
    tableId,
    handleSelectedDate,
    handleSelectTime,
    handleSelectEndTime,
    handleSelectTable,
    isLoading,
  }
}
