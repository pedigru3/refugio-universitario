import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ username: string; id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  const { username, id } = await params

  if (session?.user.role !== 'admin' && username !== session?.user.username) {
    return Response.json({}, { status: 401 })
  }

  await prisma.scheduling.delete({
    where: {
      id,
    },
  })

  return Response.json({})
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  const { username, id } = await params

  if (session?.user.role !== 'admin' && username !== session?.user.username) {
    return Response.json({}, { status: 401 })
  }

  const { date, spent_time_in_minutes } = z
    .object({
      date: z.string().optional(),
      spent_time_in_minutes: z.number().optional(),
    })
    .parse(await request.json())

  await prisma.scheduling.update({
    where: { id },
    data: {
      ...(date ? { date: new Date(date) } : {}),
      ...(spent_time_in_minutes ? { spent_time_in_minutes } : {}),
    },
  })

  return Response.json({})
}
