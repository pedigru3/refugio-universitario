import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/options'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)

  const { id } = await params
  const isOwner = session?.user.id === id
  const isAdmin = session?.user.role === 'admin'

  if (!isAdmin && !isOwner) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    name,
    role,
    course,
    education_level,
    cellphone,
    birthday,
    expires_at,
  } = await req.json()

  // Prevent non-admins from changing role or expires_at
  if (!isAdmin && (role !== undefined || expires_at !== undefined)) {
    return Response.json({ error: 'Forbidden: Cannot change sensitive fields' }, { status: 403 })
  }

  try {
    const updateData: Record<string, unknown> = {
      name,
      role,
      course,
      education_level,
    }

    if (cellphone !== undefined) {
      updateData.cellphone = cellphone?.trim() || null
    }

    if (birthday !== undefined) {
      updateData.birthday = birthday ? new Date(birthday) : null
    }

    if (expires_at !== undefined) {
      updateData.expires_at = expires_at ? new Date(expires_at) : null
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
