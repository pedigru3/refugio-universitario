import { ReactNode } from 'react'

export function IntervalItem({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex justify-between items-center py-3 px-4 border-t
    border-gray-600 first:child:border-none"
    >
      {children}
    </div>
  )
}
