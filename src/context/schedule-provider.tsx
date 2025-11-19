import { ReactNode, createContext, useState } from 'react'

interface ScheduleContextType {
  selectedDate: Date | null
  changeSelectedDate: (date: Date) => void
  tableCheckedId: string | null
  changeTableId: (tableId: string) => void
  startHour: number | null
  changeStartHour: (hour: number) => void
  endHour: number | null
  changeEndHour: (hour: number) => void
  clearAllData: () => void
}

export const ScheduleContext = createContext({} as ScheduleContextType)

interface ScheduleContextProviderProps {
  children: ReactNode
}

export function ScheduleContextProvider({
  children,
}: ScheduleContextProviderProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startHour, setSelectStartHour] = useState<number | null>(null)
  const [endHour, setEndHour] = useState<number | null>(null)
  const [tableCheckedId, setTableCheckedId] = useState<string | null>(null)

  function clearAllData() {
    setSelectStartHour(null)
    setEndHour(null)
    setTableCheckedId(null)
  }

  function changeTableId(tableId: string) {
    setTableCheckedId(tableId)
  }

  function changeSelectedDate(date: Date) {
    clearAllData()
    setSelectedDate(date)
  }

  function changeStartHour(hour: number) {
    setSelectStartHour(hour)
  }

  function changeEndHour(hour: number) {
    setEndHour(hour)
  }

  return (
    <ScheduleContext.Provider
      value={{
        selectedDate,
        changeSelectedDate,
        startHour,
        changeEndHour,
        changeStartHour,
        changeTableId,
        endHour,
        tableCheckedId,
        clearAllData,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  )
}
