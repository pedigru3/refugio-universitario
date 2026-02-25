'use client'

import { Container } from '@/components/container'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { Loading } from '@/components/loading'
import {
  Envelope,
  GraduationCap,
  SignOut,
  User,
  Cards,
  ArrowRight,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Deck = {
  id: string
  title: string
  description: string | null
  _count: {
    flashcards: number
  }
}

function MyDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDecks() {
      try {
        const response = await fetch('/api/v1/decks')
        if (response.ok) {
          const data = await response.json()
          setDecks(data)
        }
      } catch (error) {
        console.error('Erro ao carregar decks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDecks()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
        <p className="mb-4 text-zinc-400">Você ainda não criou nenhum deck</p>
        <Link
          href="/decks"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <Cards size={18} weight="bold" />
          Criar meu primeiro deck
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {decks.map((deck) => (
        <Link
          key={deck.id}
          href={`/decks/${deck.id}`}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="rounded-lg border border-purple-400/30 bg-purple-500/10 p-3">
              <Cards size={20} weight="bold" className="text-purple-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{deck.title}</p>
              <p className="text-sm text-zinc-400">
                {deck._count.flashcards} card
                {deck._count.flashcards !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ArrowRight size={20} weight="bold" className="text-zinc-400" />
        </Link>
      ))}
    </div>
  )
}

export default function Profile() {
  const { data: session, status } = useSession({ required: true })

  async function handleSignOut() {
    await signOut({
      callbackUrl: '/',
    })
  }

  if (status === 'loading') {
    return <Loading />
  }

  const user = session?.user

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white pb-20">
      <Container className="py-12">
        {/* Header do Perfil */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative">
              <Image
                src={user?.image ?? '/default-avatar.png'}
                width={120}
                height={120}
                alt="Avatar do usuário"
                className="rounded-2xl border-4 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full border-4 border-zinc-950 bg-emerald-500 p-2">
                <User size={20} weight="fill" className="text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                <p className="text-zinc-400">@{user?.username}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {user?.role === 'admin' && (
                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1 text-sm font-semibold text-purple-200">
                    Administrador
                  </span>
                )}
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-200">
                  Ativo
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-200 transition hover:border-red-300/60 hover:bg-red-500/20"
            >
              <SignOut size={20} weight="bold" />
              Sair
            </button>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          {/* Informações Acadêmicas */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3">
                <GraduationCap
                  size={24}
                  weight="bold"
                  className="text-blue-200"
                />
              </div>
              <h2 className="text-lg font-semibold">Informações Acadêmicas</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Nível de Escolaridade
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {user?.education_level || 'Não informado'}
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Curso
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {user?.course || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                <Envelope
                  size={24}
                  weight="bold"
                  className="text-emerald-200"
                />
              </div>
              <h2 className="text-lg font-semibold">Contato</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  E-mail
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {user?.email || 'Não informado'}
                </p>
              </div>
              {/* Celular e aniversário podem ser adicionados quando disponíveis na sessão */}
            </div>
          </div>
        </div>

        {/* Meus Decks */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-purple-400/30 bg-purple-500/10 p-3">
                <Cards size={24} weight="bold" className="text-purple-200" />
              </div>
              <h2 className="text-lg font-semibold">Meus Decks de estudo</h2>
            </div>
            <Link
              href="/decks"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Ver todos
            </Link>
          </div>
          <MyDecks />
        </div>
      </Container>
    </div>
  )
}
