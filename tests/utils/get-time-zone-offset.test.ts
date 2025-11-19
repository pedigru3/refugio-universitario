import { getTimeZoneOffset } from '@/utils/get-time-zone-offset'

describe('Utils: GetTimeZoneOffset', () => {
  it('shold be return timezone diff', () => {
    const diff = getTimeZoneOffset()
    expect(diff).toEqual(3)
  })
})
