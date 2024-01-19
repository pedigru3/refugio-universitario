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

  const hour = useRef<number>()

  // tables

  const [availabilityTables, setAvailabilityTables] = useState<
    AvailabilityTables[] | null
  >(null)

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

  async function handleSelectedDate(date: Date) {
    setSelectedDate(date)
    setAvailabilityTables(null)
    setTableId('')
    hour.current = undefined
  }

  async function handleSelectTime(time: number) {
    hour.current = time
    const dateWithTime = dayjs(selectedDate).set('hour', time).startOf('hour')
    const dateFormated = dateWithTime.format('YYYY-MM-DD')
    const response = await fetch(
      `/api/v1/availability/table?date=${dateFormated}&hour=${time}`,
    )
    const data = await response.json()
    const availabilityTables: AvailabilityTables[] = data.availability
    setAvailabilityTables(availabilityTables)
    setTableId('')
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
