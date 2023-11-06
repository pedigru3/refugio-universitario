import { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="flex justify-center items-center gap-3 mt-5 rounded-md w-full max-w-2xl h-12 bg-purple-500 disabled:bg-zinc-400 disabled:opacity-80"
      {...props}
    >
      {children}
    </button>
  )
}
