import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/container'
import Link from 'next/link'
import { Header } from '@/components/header'
import { CreateDeckForm } from './create-deck-form'

export const metadata: Metadata = {
  title: 'My Decks',
}

export default async function DecksPage() {
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

  const decks = await prisma.deck.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      _count: {
        select: { flashcards: true },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end text-white">
      <Header />
      <Container className="py-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            Flashcards
          </p>
          <h1 className="text-4xl font-bold">Meus decks</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Organize seus estudos com deck personalizados e acompanhe a revisão
            com repetição espaçada.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CreateDeckForm />

          {decks.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 text-center shadow-lg shadow-indigo-900/40">
              <p className="text-lg font-semibold">Nenhum deck ainda</p>
              <p className="mt-2 text-sm text-white/70">
                Crie seu primeiro deck para começar a revisar conteúdos.
              </p>
            </div>
          ) : (
            decks.map((deck) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-sky-500/10 p-6 shadow-xl shadow-indigo-900/40 transition-all hover:border-white hover:shadow-purple-900/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Deck
                    </p>
                    <span className="text-[10px] font-medium text-emerald-200 opacity-0 transition-opacity group-hover:opacity-100">
                      Estudar agora →
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold">{deck.title}</h3>
                  <p className="mt-3 text-sm text-white/70 line-clamp-2">
                    {deck.description || 'Sem descrição'}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/70">
                  <span>{deck._count.flashcards} cards</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {deck._count.flashcards > 0
                      ? 'Pronto para revisar'
                      : 'Vazio'}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Container>
    </div>
  )
}
