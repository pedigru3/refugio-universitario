import { Header } from '@/components/header'
import { ReactNode } from 'react'

export default function LayoutPrivacy({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="shadow-lg">
        <Header />
      </div>
      {children}
    </div>
  )
}
