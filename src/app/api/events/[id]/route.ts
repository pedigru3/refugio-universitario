import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  const { id } = await params

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          select: {
            user_id: true,
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
    }

    const isRegistered = session?.user ? event.registrations.some(
      (reg: any) => reg.user_id === session?.user?.id
    ) : false

    const registrationsCount = event.registrations.length
    const isFull = registrationsCount >= event.max_capacity

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        imageUrl: event.image_url,
        maxCapacity: event.max_capacity,
        isFull,
      },
      user: {
        isRegistered,
        hasCellphone: session?.user ? !!session.user.cellphone : false
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
