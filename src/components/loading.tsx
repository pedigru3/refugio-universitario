import { CircleNotch } from '@phosphor-icons/react'

export function Loading() {
  return (
    <div className="flex justify-center items-center h-52">
      <CircleNotch size={32} className="animate-spin " />
    </div>
  )
}
