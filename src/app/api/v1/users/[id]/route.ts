import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/options'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const {
    name,
    role,
    course,
    educationLevel,
    cellphone,
    birthday,
    isActive,
  } = await req.json()

  try {
    const updateData: Record<string, unknown> = {
      name,
      role,
      course,
      education_level: educationLevel,
    }

    if (cellphone !== undefined) {
      updateData.cellphone = cellphone?.trim() || null
    }

    if (birthday !== undefined) {
      updateData.birthday = birthday ? new Date(birthday) : null
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return Response.json({ user }, { status: 200 })
  } catch (error) {
    return Response.json({ error: `${error}` }, { status: 400 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({ user }, { status: 200 })
}
