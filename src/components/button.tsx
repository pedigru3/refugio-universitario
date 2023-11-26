import { CircleNotch } from '@phosphor-icons/react'
import { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  bgColor?: 'purple' | 'gray'
  isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  bgColor = 'purple',
  isLoading = false,
  ...props
}: ButtonProps) {
  const colorBackground =
    bgColor === 'purple'
      ? 'bg-purple-500 enabled:hover:bg-purple-300'
      : 'bg-gray-600 enabled:hover:bg-gray-400'
  return (
    <button
      disabled={isLoading}
      className={`flex justify-center items-center gap-3 mt-5 rounded-md w-full
    max-w-2xl h-12 ${colorBackground} disabled:bg-zinc-400 disabled:opacity-80
    `}
      {...props}
    >
      {isLoading ? (
        <CircleNotch size={32} className="animate-spin " />
      ) : (
        children
      )}
    </button>
  )
}
