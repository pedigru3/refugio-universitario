import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'

test('shold be convert time string to minutes', () => {
  const hours = convertTimeStringToMinutes('8:00')
  expect(hours).toEqual(480)

  const hoursAndMinutes = convertTimeStringToMinutes('23:59')
  expect(hoursAndMinutes).toEqual(1439)
})
