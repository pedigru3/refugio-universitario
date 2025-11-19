import { Header } from '@/components/header'
import { ReactNode } from 'react'

export default function LayoutPattern({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end min-h-screen">
        <div className="shadow-lg">
          <Header />
        </div>
        {children}
      </div>
    </div>
  )
}
