import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { buildUsersWhere } from '../filters'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') ?? 'all'

  const where = buildUsersWhere(filter)

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      course: true,
      expires_at: true,
      Scheduling: {
        orderBy: { date: 'desc' },
        take: 1,
        select: {
          date: true,
          check_in: true,
        },
      },
    },
    orderBy: { name: 'asc' },
    take: 200, // safety cap for rendering
  })

  return NextResponse.json({ count: users.length, users })
}
