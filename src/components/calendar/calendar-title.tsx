import { ReactNode } from 'react'

export function CalendarTitle({ children }: { children: ReactNode }) {
  return <div className="font-medium capitalize">{children}</div>
}
