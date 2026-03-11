import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

// Intervalos em minutos
const AGAIN_INTERVAL_MINUTES = 10 // "Again" sempre volta para 10 minutos
const GLOBAL_MODIFIER = 1 // modificador global caso queira acelerar/desacelerar todo o baralho

// Multiplicadores no estilo Anki
// 1: Again, 2: Hard, 3: Good, 4: Easy
const MULTIPLIERS: Record<number, number> = {
  2: 1.2,
  3: 2.5,
  4: 4,
}

function calculateNextReview(
  rating: number,
  previousIntervalMinutes: number,
  previousRepetitions: number,
) {
  let interval: number
  let repetitions = previousRepetitions

  // Again (errou): sempre volta para 10 minutos e zera repetições
  if (rating === 1) {
    interval = AGAIN_INTERVAL_MINUTES
    repetitions = 0
  } else if (previousIntervalMinutes === 0) {
    // Primeiro estudo do card (novo): usa valores específicos
    // Difícil: 10 min, Bom: 1 dia, Fácil: 3 dias
    if (rating === 2) {
      interval = 10 // 10 minutos
    } else if (rating === 3) {
      interval = 1 * 24 * 60 // 1 dia
    } else {
      // rating === 4
      interval = 3 * 24 * 60 // 3 dias
    }
    repetitions = 1
  } else {
    // Card já estudado antes: segue a lógica multiplicativa
    const effectivePreviousInterval = previousIntervalMinutes
    const multiplier = MULTIPLIERS[rating] ?? 1

    interval = Math.round(
      effectivePreviousInterval * multiplier * GLOBAL_MODIFIER,
    )
    repetitions += 1
  }

  // Garante um mínimo de 10 minutos para qualquer resposta diferente de "Again"
  if (rating !== 1 && interval < AGAIN_INTERVAL_MINUTES) {
    interval = AGAIN_INTERVAL_MINUTES
  }

  return {
    interval,
    repetitions,
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const body = await req.json()
    const { rating } = body // 1: Again, 2: Hard, 3: Good, 4: Easy

    if (![1, 2, 3, 4].includes(rating)) {
      return new NextResponse('Invalid rating', { status: 400 })
    }

    const card = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        deck: true,
      },
    })

    if (!card || card.deck.user_id !== user.id) {
      return new NextResponse('Card not found', { status: 404 })
    }

    const previousIntervalMinutes =
      card.interval && card.interval > 0 ? card.interval : 0

    const { interval, repetitions } = calculateNextReview(
      rating,
      previousIntervalMinutes,
      card.repetitions,
    )

    const nextReview = new Date()
    nextReview.setMinutes(nextReview.getMinutes() + interval)

    const updatedCard = await prisma.flashcard.update({
      where: { id },
      data: {
        interval,
        repetitions,
        next_review: nextReview,
      },
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    console.error('[REVIEW_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
