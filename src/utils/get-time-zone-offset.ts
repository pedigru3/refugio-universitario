export function getTimeZoneOffset() {
  const nowDate = new Date()

  const offsetMinutes = nowDate.getTimezoneOffset()

  const offsetHors = offsetMinutes / 60

  return offsetHors
}
