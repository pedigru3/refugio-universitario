import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/container'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { AddCardForm } from './add-card-form'
import { DeleteDeckButton } from './delete-deck-button'
import { StudyButton } from './study-button'

export const metadata: Metadata = {
  title: 'Manage Deck',
}

export default async function DeckPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div>Unauthorized</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <div>User not found</div>
  }

  const deck = await prisma.deck.findUnique({
    where: {
      id: params.id,
    },
    include: {
      flashcards: {
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  })

  if (!deck) {
    notFound()
  }

  if (deck.user_id !== user.id) {
    redirect('/decks')
  }

  const totalCards = deck.flashcards.length
  const cardsDue = deck.flashcards.filter(
    (card) => new Date(card.next_review) <= new Date(),
  ).length

  function formatInterval(minutes: number | null) {
    if (!minutes || minutes <= 0) {
      return 'Novo'
    }

    if (minutes < 60) {
      return `${minutes} min`
    }

    if (minutes < 1440) {
      const hours = minutes / 60
      return `${hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1)} h`
    }

    const days = minutes / 1440
    return `${days % 1 === 0 ? days.toFixed(0) : days.toFixed(1)} d`
  }

  return (
    <div className="min-h-screen w-full bg-purple-950 text-white">
      <Header />
      <Container className="py-12">
        <div className="mb-10 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/decks" className="text-zinc-300 hover:text-white">
            Decks
          </Link>
          <span>/</span>
          <span className="text-white/90">{deck.title}</span>
        </div>

        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-sky-500/10 p-8 shadow-2xl shadow-indigo-900/40">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  Deck
                </p>
                <h1 className="mt-2 text-4xl font-bold text-white">
                  {deck.title}
                </h1>
                {deck.description && (
                  <p className="mt-3 max-w-2xl text-sm text-zinc-300">
                    {deck.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90">
                  {totalCards} cards
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-200">
                  {cardsDue} pendentes
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <DeleteDeckButton deckId={deck.id} />
              <StudyButton deckId={deck.id} disabled={cardsDue === 0} />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AddCardForm deckId={deck.id} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Cards</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Lista atualizada
              </span>
            </div>
            <div className="space-y-4">
              {deck.flashcards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-sky-500/10 p-8 text-center text-white/70">
                  Nenhum card por aqui. Adicione o primeiro para começar.
                </div>
              ) : (
                deck.flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-sky-500/10 p-5 text-white shadow-lg shadow-indigo-900/40"
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                          Frente
                        </span>
                        <p className="mt-2 text-lg text-white/90">
                          {card.front}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                          Verso
                        </span>
                        <p className="mt-2 text-white/90">{card.back}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 border-t border-white/10 pt-3 text-xs text-zinc-400">
                      <span>
                        Próxima revisão:{' '}
                        {new Date(card.next_review).toLocaleDateString()}
                      </span>
                      <span>Intervalo: {formatInterval(card.interval)}</span>
                      <span>Repetições: {card.repetitions}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
