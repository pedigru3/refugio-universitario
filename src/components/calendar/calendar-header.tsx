import { ReactNode } from 'react'

export function CalendarHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>
}
