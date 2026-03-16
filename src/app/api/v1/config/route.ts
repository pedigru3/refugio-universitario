import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { type NextRequest } from 'next/server'

export async function GET() {
  const config = await prisma.systemConfig.findUnique({
    where: { key: 'MAX_CAPACITY' },
  })

  return Response.json({ maxCapacity: config ? Number(config.value) : 20 })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { maxCapacity } = await request.json()

  await prisma.systemConfig.upsert({
    where: { key: 'MAX_CAPACITY' },
    update: { value: String(maxCapacity) },
    create: {
      key: 'MAX_CAPACITY',
      value: String(maxCapacity),
    },
  })

  return Response.json({ message: 'Config updated' })
}
