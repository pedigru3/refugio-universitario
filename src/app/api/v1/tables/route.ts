import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '../../auth/[...nextauth]/options'

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
