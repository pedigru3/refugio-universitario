import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="px-8 md:px-16 lg:px-20 lg:mx-auto lg:max-w-[1380px]">
      {children}
    </div>
  )
}
