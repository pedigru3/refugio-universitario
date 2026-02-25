import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/container'
import { Header } from '@/components/header'
import { notFound, redirect } from 'next/navigation'
import { StudySession } from './study-session'

export const metadata: Metadata = {
  title: 'Study Session',
}

export default async function StudyPage({
  params,
}: {
  params: { id: string }
}) {
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
  })

  if (!deck) {
    notFound()
  }

  if (deck.user_id !== user.id) {
    redirect('/decks')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end text-white">
      <Header />
      <Container className="py-10">
        <StudySession deckId={deck.id} deckTitle={deck.title} />
      </Container>
    </div>
  )
}
