import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '../../auth/[...nextauth]/options'
import { NextRequest } from 'next/server'

const tableFormSchema = z.object({
  table_name: z
    .string()
    .min(3, { message: 'O nome da mesa deve ter pelo menos 3 letras' }),
  chair_count: z.number().min(1),
})

export async function GET() {
  const tables = await prisma.table.findMany({
    select: {
      id: true,
      table_name: true,
      chair_count: true,
    },
  })

  return Response.json({ tables })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({}, { status: 401 })
  }

  const body = await req.json()

  const { chair_count: chairCount, table_name: tableName } =
    tableFormSchema.parse(body)

  await prisma.table.create({
    data: {
      table_name: tableName,
      chair_count: chairCount,
    },
  })

  return Response.json({})
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({}, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id || id === '') {
    return Response.json({ error: 'id not found' }, { status: 400 })
  }

  try {
    await prisma.scheduling.deleteMany({
      where: {
        table_id: id,
      },
    })

    await prisma.table.delete({
      where: {
        id,
      },
    })

    return Response.json({})
  } catch (error) {
    return Response.json(
      { error: 'error when deleting table' },
      { status: 500 },
    )
  }
}
