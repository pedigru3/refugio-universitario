import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/options'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const { name, role, course, educationLevel } = await req.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        course,
        education_level: educationLevel,
      },
    })

    return Response.json({ user }, { status: 200 })
  } catch (error) {
    return Response.json({ error: `${error}` }, { status: 400 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({ user }, { status: 200 })
}
