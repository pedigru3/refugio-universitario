import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

type RouteParams = {
  params: { username: string; id: string }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)

  const username = params.username
  const id = params.id

  console.log(id)
  console.log(username)

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
