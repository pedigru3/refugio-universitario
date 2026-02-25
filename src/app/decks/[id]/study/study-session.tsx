'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/button'
import Link from 'next/link'

type Flashcard = {
  id: string
  front: string
  back: string
  deck_id: string
  interval: number
  repetitions: number
}

function formatInterval(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  return `${days}d`
}

export function StudySession({
  deckId,
  deckTitle,
}: {
  deckId: string
  deckTitle: string
}) {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch(`/api/v1/decks/${deckId}/study`)
        if (!response.ok) throw new Error('Failed to fetch cards')
        const data = await response.json()
        setCards(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [deckId])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleRate = async (rating: number) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const currentCard = cards[currentIndex]

    try {
      await fetch(`/api/v1/cards/${currentCard.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      })

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
      } else {
        setIsFinished(true)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-zinc-200 backdrop-blur">
          Carregando cards...
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-white">
        <div className="mb-6 rounded-full border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">Sessão concluída!</h2>
        <p className="mt-2 text-zinc-300">
          Você revisou todos os cards pendentes deste deck.
        </p>
        <Link
          href={`/decks/${deckId}`}
          className="mt-8 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
        >
          Voltar para o deck
        </Link>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-white">
        <h2 className="text-3xl font-bold">Nenhum card devido</h2>
        <p className="mt-2 max-w-md text-zinc-300">
          Você está em dia! Volte mais tarde para continuar estudando.
        </p>
        <Link
          href={`/decks/${deckId}`}
          className="mt-8 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/40 hover:bg-white/20"
        >
          Voltar para o deck
        </Link>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  // Intervalo base para sugerir os próximos intervalos (10 min para cards novos)
  const baseInterval = currentCard.interval > 0 ? currentCard.interval : 10
  const isNewCard = currentCard.interval === 0

  const ratingOptions = [
    {
      label: 'Errei',
      rating: 1,
      // Again sempre volta para 10 minutos
      hint: '10 min',
      classes:
        'border-red-400/30 bg-red-500/10 text-red-100 hover:border-red-300/60 hover:bg-red-500/20',
    },
    {
      label: 'Difícil',
      rating: 2,
      hint:
        // Primeiro estudo: 10 min, depois intervalo × 1.2
        isNewCard ? '10 min' : formatInterval(Math.round(baseInterval * 1.2)),
      classes:
        'border-orange-400/30 bg-orange-500/10 text-orange-100 hover:border-orange-300/60 hover:bg-orange-500/20',
    },
    {
      label: 'Bom',
      rating: 3,
      hint:
        // Primeiro estudo: 1 dia, depois intervalo × 2.5
        isNewCard
          ? '1 dia'
          : formatInterval(Math.round(baseInterval * 2.5)),
      classes:
        'border-blue-400/30 bg-blue-500/10 text-blue-100 hover:border-blue-300/60 hover:bg-blue-500/20',
    },
    {
      label: 'Fácil',
      rating: 4,
      hint:
        // Primeiro estudo: 3 dias, depois intervalo × 4
        isNewCard
          ? '3 dias'
          : formatInterval(Math.round(baseInterval * 4)),
      classes:
        'border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:border-emerald-300/60 hover:bg-emerald-500/20',
    },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-white">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          Estudo
        </p>
        <h1 className="text-3xl font-semibold">{deckTitle}</h1>
        <p className="text-sm text-zinc-400">
          Card {currentIndex + 1} de {cards.length}
        </p>
      </div>

      <div
        className="relative h-80 w-full max-w-2xl cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className="relative h-full w-full transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 text-center text-2xl font-medium text-white shadow-[0_25px_120px_-40px_rgba(16,185,129,0.4)]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <p className="text-balance">{currentCard.front}</p>
            <span className="absolute bottom-6 text-xs uppercase tracking-[0.4em] text-zinc-400">
              Toque para virar
            </span>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-8 text-center text-2xl font-medium text-white shadow-[0_25px_120px_-40px_rgba(16,185,129,0.4)]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-balance">{currentCard.back}</p>
          </div>
        </div>
      </div>

      {isFlipped ? (
        <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {ratingOptions.map((option) => (
            <button
              key={option.rating}
              onClick={() => handleRate(option.rating)}
              disabled={isSubmitting}
              className={`flex flex-col items-center rounded-2xl border p-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${option.classes}`}
            >
              <span>{option.label}</span>
              <span className="text-xs text-white/70">{option.hint}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex w-full max-w-xs items-center justify-center">
          <Button
            onClick={handleFlip}
            className="!mt-0 w-full !bg-white/90 !text-zinc-900 hover:!bg-white"
          >
            Mostrar resposta
          </Button>
        </div>
      )}
    </div>
  )
}
