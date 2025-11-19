import { convertNumberTwoDigitsString } from './convert-number-two-digits-string'

describe('convert number two digits string', () => {
  it('shold be return a digit with zero', () => {
    const newNumber = convertNumberTwoDigitsString('1')
    expect(newNumber).toEqual('01')
  })
  it('shold be return 10', () => {
    const newNumber = convertNumberTwoDigitsString('10')
    expect(newNumber).toEqual('10')
  })
})
