'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

export function CreateDeckForm() {
    const [isCreating, setIsCreating] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/v1/decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            })

            if (!response.ok) {
                throw new Error('Failed to create deck')
            }

            setTitle('')
            setDescription('')
            setIsCreating(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to create deck')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isCreating) {
        return (
            <button
                onClick={() => setIsCreating(true)}
                className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-dashed border-white/30 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-sky-500/10 p-6 text-left text-white shadow-lg shadow-indigo-900/30 transition hover:border-white hover:shadow-purple-900/40"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.4em] text-zinc-400">
                        Novo deck
                    </span>
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold text-emerald-200">
                        Clique para criar
                    </span>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold">Adicionar deck</h3>
                    <p className="mt-2 text-sm text-zinc-300">
                        Organize um novo assunto e comece a adicionar cards.
                    </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-200">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/10">
                        +
                    </span>
                    Criar deck
                </div>
            </button>
        )
    }

    return (
        <div className="flex flex-col rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/15 via-purple-500/5 to-sky-500/10 p-6 text-white shadow-xl shadow-indigo-900/40">
            <h3 className="mb-4 text-xl font-semibold">Novo deck</h3>
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
                <div>
                    <label htmlFor="title" className="sr-only">
                        Título
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Título do deck"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                        required
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="description" className="sr-only">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-24 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                </div>
                <div className="mt-auto flex gap-3">
                    <Button
                        type="button"
                        bgColor="gray"
                        className="!mt-0 flex-1 !bg-white/10 !text-white hover:!bg-white/20"
                        onClick={() => setIsCreating(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="!mt-0 flex-1 !bg-emerald-600 hover:!bg-emerald-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Criando...' : 'Criar'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
