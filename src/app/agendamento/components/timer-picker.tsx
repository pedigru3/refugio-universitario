import { TimePickerItem } from '@/components/time-picker-item'
import { Availability } from '@/hooks/useSchedule'

type TimePickerProps = {
  weekDay: string | null
  describeDate: string | null
  isLoading: boolean
  availabilityTimes: Availability | undefined
  currentHour: number | undefined
  handleSelectTime: (value: number) => void
}

export function TimePickerComponent({
  availabilityTimes,
  describeDate,
  isLoading,
  weekDay,
  handleSelectTime,
  currentHour,
}: TimePickerProps) {
  const availability = availabilityTimes

  return (
    <div
      id="TimePicker"
      className="
       text-white  border-solid
   border-gray-600 pt-2 px-2  w-full"
    >
      <div id="TimePickerHeader" className="text-lg">
        {describeDate}
      </div>

      <div id="TimePickerList" className=" grid grid-cols-3 gap-2 pt-4">
        {availability?.possibleTimes.map((time) => {
          return (
            <TimePickerItem
              onClick={() => handleSelectTime(time)}
              isChecked={time === currentHour}
              key={time}
              disabled={!availability.availableTimes.includes(time)}
            >
              {String(time).padStart(2, '0')}:00h
            </TimePickerItem>
          )
        })}
        {isLoading &&
          Array.from({ length: 8 }, (_, index) => (
            <button
              className="h-9 w-full bg-gray-600 rounded-lg animate-pulse"
              key={index}
            ></button>
          ))}
      </div>
    </div>
  )
}
