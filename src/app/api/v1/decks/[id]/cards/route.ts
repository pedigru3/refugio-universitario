import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    const deck = await prisma.deck.findFirst({
      where: {
        id: params.id,
        user_id: user.id,
      },
    })

    if (!deck) {
      return new NextResponse('Deck not found', { status: 404 })
    }

    const cards = await prisma.flashcard.findMany({
      where: {
        deck_id: params.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('[CARDS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    // Verify deck ownership
    const deck = await prisma.deck.findFirst({
      where: {
        id: params.id,
        user_id: user.id,
      },
    })

    if (!deck) {
      return new NextResponse('Deck not found', { status: 404 })
    }

    const body = await req.json()
    const { front, back } = body

    if (!front || !back) {
      return new NextResponse('Front and back are required', { status: 400 })
    }

    const card = await prisma.flashcard.create({
      data: {
        front,
        back,
        deck_id: params.id,
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error('[CARDS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
