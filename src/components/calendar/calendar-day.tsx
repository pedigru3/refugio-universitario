import { ReactNode } from 'react'

export function CalendarDay({
  children,
  ...props
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full aspect-square bg-gray-600 text-center enabled:cursor-pointer
    rounded-md focus:shadow-sm hover:enabled:bg-gray-400 disabled:bg-none disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  )
}
