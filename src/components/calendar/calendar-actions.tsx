import { ReactNode } from 'react'

export function CalendarActions({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 text-gray-400">{children}</div>
}
