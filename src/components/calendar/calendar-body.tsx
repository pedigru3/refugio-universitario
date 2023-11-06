import { ReactNode } from 'react'

export function CalendarBody({ children }: { children: ReactNode }) {
  return (
    <table className="w-full border-separate border-spacing-1 table-fixed text-sm">
      {children}
    </table>
  )
}
