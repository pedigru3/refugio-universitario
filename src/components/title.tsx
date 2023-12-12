import React, { HTMLProps, ReactNode } from 'react'

interface TitleProps {
  type: 'h1' | 'h2' | 'h3'
  color: 'light' | 'dark'
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
}

export function Title({ type, color, children, className }: TitleProps) {
  if (type === 'h2') {
    return (
      <h2
        className={`${
          color === 'dark' ? 'text-gray-800' : 'text-white'
        } font-bold text-2xl max-w-[16rem] lg:text-5xl lg:mt-2 lg:pb-2
        font-plus-jakarta-sans ${className} `}
      >
        {children}
      </h2>
    )
  }
}
