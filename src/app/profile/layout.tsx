import LayoutPattern from '@/components/layout-pattern'
import { ReactNode } from 'react'

export default function LayoutProfile({ children }: { children: ReactNode }) {
  return <LayoutPattern>{children}</LayoutPattern>
}
