'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

export function AddCardForm({ deckId }: { deckId: string }) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/v1/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ front, back }),
      })

      if (!response.ok) {
        throw new Error('Failed to add card')
      }

      setFront('')
      setBack('')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to add card')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sticky top-6 rounded-2xl border border-white/20 p-6 text-white shadow-xl shadow-indigo-900/30">
      <h3 className="mb-4 text-lg font-semibold">Adicionar novo card</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="front"
            className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400"
          >
            Frente
          </label>
          <textarea
            id="front"
            placeholder="Pergunta ou termo"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="h-28 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            required
          />
        </div>
        <div>
          <label
            htmlFor="back"
            className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400"
          >
            Verso
          </label>
          <textarea
            id="back"
            placeholder="Resposta ou definição"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="h-28 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            required
          />
        </div>
        <Button
          type="submit"
          className="!mt-2 !bg-emerald-600 hover:!bg-emerald-500"
          disabled={isLoading}
        >
          {isLoading ? 'Adicionando...' : 'Adicionar card'}
        </Button>
      </form>
    </div>
  )
}
