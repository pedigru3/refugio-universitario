import { TimePickerItem } from '@/components/time-picker-item'
import { Availability } from '../page'

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
      className="lg:absolute lg:right-0 lg:top-0 lg:bottom-0 text-white border-t lg:border-l border-solid
   border-gray-600 pt-6 px-6 lg:overflow-y-scroll lg:w-[280px]"
    >
      <div id="TimePickerHeader">
        {weekDay} <span className="text-gray-400"> {describeDate} </span>
      </div>

      <div
        id="TimePickerList"
        className="mt-3 grid grid-cols-2 lg:grid-cols-1 gap-2
    last:mb-6
    "
      >
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
