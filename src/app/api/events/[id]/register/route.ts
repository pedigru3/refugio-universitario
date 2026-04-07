import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado. Faça login para continuar.' }, { status: 401 })
  }

  const { id } = await params
  const userId = session.user.id

  try {
    // 1. Verify Event Exists and Capacity
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

    // 2. Verify User has Cellphone
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cellphone: true }
    })

    if (!user || user.cellphone === null || user.cellphone.trim() === '') {
      return NextResponse.json({ 
        error: 'É necessário ter o celular preenchido no perfil para confirmar presença.',
        code: 'MISSING_CELLPHONE'
      }, { status: 403 })
    }

    // 3. Verify Capacity
    const registrationsCount = event.registrations.length
    if (registrationsCount >= event.max_capacity) {
      return NextResponse.json({ error: 'As vagas para este evento já estão esgotadas.' }, { status: 403 })
    }

    // 4. Verify Not Already Registered
    const isRegistered = event.registrations.some(
      (reg) => reg.user_id === userId
    )

    if (isRegistered) {
      return NextResponse.json({ error: 'Você já confirmou presença neste evento.' }, { status: 400 })
    }

    // 5. Create Registration
    await prisma.eventRegistration.create({
      data: {
        event_id: id,
        user_id: userId,
      }
    })

    return NextResponse.json({ message: 'Presença confirmada com sucesso!' }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const userId = session.user.id

  try {
    await prisma.eventRegistration.delete({
      where: {
        event_id_user_id: {
          event_id: id,
          user_id: userId
        }
      }
    })

    return NextResponse.json({ message: 'Inscrição cancelada com sucesso.' }, { status: 200 })
  } catch (error) {
    console.error("Erro ao cancelar:", error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
