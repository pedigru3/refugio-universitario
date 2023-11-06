import { ReactNode } from 'react'

export function CalendarContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-zinc-800 rounded-lg">
      {children}
    </div>
  )
}
