import { ReactNode } from 'react'

type TitleProps = {
  type: 'h1' | 'h2' | 'h3'
  color: 'light' | 'dark'
  children: ReactNode
}

export function Title({ type, color, children }: TitleProps) {
  if (type === 'h2') {
    return (
      <h2
        className={`${
          color === 'dark' ? 'text-gray-800' : 'text-white'
        } font-bold text-2xl max-w-[16rem] 
        font-plus-jakarta-sans `}
      >
        {children}
      </h2>
    )
  }
}
