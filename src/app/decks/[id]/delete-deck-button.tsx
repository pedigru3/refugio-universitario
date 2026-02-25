'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteDeckButton({ deckId }: { deckId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (
            !confirm(
                'Tem certeza que deseja remover este deck? Esta ação não pode ser desfeita.',
            )
        ) {
            return
        }

        setIsDeleting(true)

        try {
            const response = await fetch(`/api/v1/decks/${deckId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete deck')
            }

            router.push('/decks')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to delete deck')
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-400/60 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isDeleting ? 'Removendo...' : 'Excluir deck'}
        </button>
    )
}
