export function convertNumberTwoDigitsString(value: string | null) {
  if (value === null) {
    return null
  }
  const myNumber = Number(value)
  return myNumber.toLocaleString('pt-BR', { minimumIntegerDigits: 2 })
}
