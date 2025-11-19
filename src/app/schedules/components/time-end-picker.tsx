import { TimePickerComponent } from '@/app/agendamento/components/timer-picker'
import { ScheduleContext } from '@/context/schedule-provider'
import { Availability } from '@/hooks/useSchedule'
import dayjs from 'dayjs'
import { useContext } from 'react'
import useSWR from 'swr'

export function TimeEndPicker() {
  const { selectedDate, endHour, changeEndHour, startHour, tableCheckedId } =
    useContext(ScheduleContext)

  const { data: availabilityEndTimes, isLoading } = useSWR<Availability>(
    startHour
      ? ['availabilityEndHours', [tableCheckedId, selectedDate, startHour]]
      : null,
    async () => {
      const response = await fetch(
        `/api/v2/availability/end-time?id=${tableCheckedId}&date=${dayjs(
          selectedDate,
        ).format('YYYY-MM-DD')}&hour=${startHour}`,
      )
      const json = await response.json()
      return json
    },
  )

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const isVisible = isLoading === true || availabilityEndTimes !== undefined

  return (
    isVisible && (
      <div className="bg-zinc-800 mt-1 rounded-md p-2 pb-5">
        <div className="flex gap-3">
          <TimePickerComponent
            isLoading={isLoading}
            availabilityTimes={availabilityEndTimes}
            currentHour={endHour}
            describeDate={`Horário de saída`}
            handleSelectTime={(hour) => {
              changeEndHour(hour)
            }}
            weekDay={weekDay}
          />
        </div>
      </div>
    )
  )
}
