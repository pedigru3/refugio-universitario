import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className="px-8 md:px-52">{children}</div>
}
