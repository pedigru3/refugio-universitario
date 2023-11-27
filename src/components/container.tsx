import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className="px-8 lg:mx-auto lg:container">{children}</div>
}
