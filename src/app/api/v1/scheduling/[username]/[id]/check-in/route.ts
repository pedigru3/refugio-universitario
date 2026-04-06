import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

type RouteParams = {
  params: Promise<{ username: string; id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scheduling = await prisma.scheduling.findUnique({
    where: { id },
  })

  if (!scheduling) {
    return Response.json({ error: 'Scheduling not found' }, { status: 404 })
  }

  const updatedScheduling = await prisma.scheduling.update({
    where: { id },
    data: {
      check_in: scheduling.check_in ? null : new Date(),
    },
  })

  return Response.json({ checkIn: updatedScheduling.check_in })
}
