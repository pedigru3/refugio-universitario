import { getWeekDays } from '@/utils/get-week-days'

describe('getWeekDays', () => {
  it('should return full week days by default', () => {
    const result = getWeekDays()
    const expected = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ]
    expect(result).toEqual(expected)
  })

  it('should return short week days when short is true', () => {
    const result = getWeekDays({ short: true })
    const expected = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
    expect(result).toEqual(expected)
  })

  it('should return full week days when short is false', () => {
    const result = getWeekDays({ short: false })
    const expected = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ]
    expect(result).toEqual(expected)
  })

  // Add more test cases as needed
})
