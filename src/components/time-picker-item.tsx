import { ReactNode } from 'react'

export function TimePickerItem({
  children,
  disabled,
}: {
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      disabled={disabled ?? false}
      className="
  border-none bg-gray-600 py-2 cursor-pointer
   text-gray-100 rounded-md text-sm disabled:bg-none disabled:cursor-default
   disabled:opacity-40 hover:enabled:bg-gray-500 focus:shadow-sm 
  "
    >
      {children}
    </button>
  )
}
