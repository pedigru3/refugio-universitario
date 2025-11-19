import { ReactNode } from 'react'

export function CalendarContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:p-6 px-3 py-6 bg-zinc-800 rounded-lg">
      {children}
    </div>
  )
}
