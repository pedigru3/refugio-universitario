import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        user_id: session.user.id
      },
      include: {
        event: true
      },
      orderBy: {
        event: {
          date: 'asc'
        }
      }
    })

    return NextResponse.json({ registrations }, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
