'use client'

import { useRouter } from 'next/navigation'

type StudyButtonProps = {
  deckId: string
  disabled: boolean
}

export function StudyButton({ deckId, disabled }: StudyButtonProps) {
  const router = useRouter()

  function handleClick() {
    if (disabled) return
    router.push(`/decks/${deckId}/study`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-disabled={disabled}
      className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition ${
        disabled
          ? 'cursor-not-allowed bg-white/10 text-zinc-400'
          : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
        />
      </svg>
      {disabled ? 'Nenhum card devido' : 'Iniciar estudo'}
    </button>
  )
}
