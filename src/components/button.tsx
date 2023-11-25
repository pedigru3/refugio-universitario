import { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  bgColor?: 'purple' | 'gray'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  bgColor = 'purple',
  ...props
}: ButtonProps) {
  const colorBackground = bgColor === 'purple' ? 'bg-purple-500' : 'bg-gray-600'
  return (
    <button
      className={`flex justify-center items-center gap-3 mt-5 rounded-md w-full
    max-w-2xl h-12 ${colorBackground} disabled:bg-zinc-400 disabled:opacity-80`}
      {...props}
    >
      {children}
    </button>
  )
}
