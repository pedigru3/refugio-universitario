import { ReactNode } from 'react'

export function CalendarDay({
  children,
  isChecked,
  ...props
}: {
  children: ReactNode
  isChecked: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full aspect-square  text-center enabled:cursor-pointer
    rounded-md focus:shadow-sm disabled:bg-none 
    disabled:cursor-default disabled:opacity-40 
    ${
      isChecked
        ? 'bg-blue-700 hover:enabled:bg-blue-400'
        : 'bg-gray-600 hover:enabled:bg-gray-400'
    }`}
    >
      {children}
    </button>
  )
}
