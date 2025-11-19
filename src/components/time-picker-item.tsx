import { ReactNode } from 'react'

export function TimePickerItem({
  children,
  disabled,
  isChecked,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  isChecked: boolean
  onClick: () => void
}) {
  function handleSelectTime() {
    onClick()
  }

  return (
    <button
      onClick={handleSelectTime}
      disabled={disabled ?? false}
      className={`
  border-none py-2 cursor-pointer
   text-gray-100 rounded-md text-sm disabled:bg-none disabled:cursor-default
   disabled:opacity-40 focus:shadow-sm h-10
   ${
     isChecked
       ? 'bg-blue-700  hover:enabled:bg-blue-500'
       : 'bg-gray-600 hover:enabled:bg-gray-500'
   }
  `}
    >
      {children}
    </button>
  )
}
