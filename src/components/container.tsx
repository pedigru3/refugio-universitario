import { HTMLProps, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`px-8 md:px-16 lg:px-20 lg:mx-auto 
    lg:max-w-[1380px] ${className}`}
    >
      {children}
    </div>
  )
}
