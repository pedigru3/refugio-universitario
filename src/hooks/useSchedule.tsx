import dayjs from 'dayjs'
import { useRef, useState } from 'react'
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

  const hour = useRef<number | undefined>(undefined)

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

  async function handleSelectedDate(date: Date) {
    setSelectedDate(date)
    setAvailabilityTables(null)
    setTableId('')
    hour.current = undefined
  }

  async function handleSelectTime(time: number) {
    hour.current = time
    // Force re-render to show the confirmation section
    setTableId(String(time))
  }

  function handleSelectTable(isTableSelected: boolean, tableId: string) {
    isTableSelected ? setTableId(tableId) : setTableId('')
  }

  return {
    availability,
    availabilityTables,
    selectedDate,
    hour,
    weekDay,
    tableId,
    handleSelectedDate,
    handleSelectTime,
    handleSelectTable,
    isLoading,
  }
}
