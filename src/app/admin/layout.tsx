import { ReactNode } from 'react'
import { MenuAdmin } from './components/menu'

export default function LayouyAdmin({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="min-w-[250px] bg-purple-900 shadow-sm">
        <MenuAdmin />
      </div>
      <div className="bg-purple-800 w-full">{children}</div>
    </div>
  )
}
