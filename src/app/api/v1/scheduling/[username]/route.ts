import { prisma } from '@/lib/prisma'
import { z } from 'zod'

type RouteParams = {
  params: { username: string }
}

export async function POST(request: Request, { params }: RouteParams) {
  const username = params.username

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  const BorySchema = z.object({
    date: z.string(),
    table_id: z.string(),
  })

  try {
    const bory = await request.json()

    const { date, table_id: tableId } = BorySchema.parse(bory)

    console.log('dataDATA ', date)

    await prisma.scheduling.create({
      data: {
        date,
        user_id: userExists.id,
        table_id: tableId,
      },
    })
    return Response.json({}, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Something unexpected happened' },
      { status: 500 },
    )
  }
}
