import { TimePickerComponent } from '@/app/agendamento/components/timer-picker'
import { ScheduleContext } from '@/context/schedule-provider'
import { Availability } from '@/hooks/useSchedule'
import dayjs from 'dayjs'
import { useContext } from 'react'
import useSWR from 'swr'

export function TimeStartPicker() {
  const { selectedDate, startHour, tableCheckedId, changeStartHour } =
    useContext(ScheduleContext)

  const { data: availabilityTimes, isLoading } = useSWR<Availability>(
    tableCheckedId
      ? ['availabilityTimes', [tableCheckedId, selectedDate]]
      : null,
    async () => {
      const response = await fetch(
        `/api/v2/availability/table?id=${tableCheckedId}&date=${dayjs(
          selectedDate,
        ).format('YYYY-MM-DD')}`,
      )
      const json = await response.json()
      return json
    },
  )

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const isVisible = isLoading === true || availabilityTimes !== undefined

  return (
    isVisible && (
      <div className="bg-zinc-800 mt-1 rounded-md p-2 pb-5">
        <div className="flex gap-3">
          <TimePickerComponent
            isLoading={isLoading}
            availabilityTimes={availabilityTimes}
            currentHour={startHour}
            describeDate={`Horário de chegada`}
            handleSelectTime={async (hour) => {
              changeStartHour(hour)
            }}
            weekDay={weekDay}
          />
        </div>
      </div>
    )
  )
}
