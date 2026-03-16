import { prisma } from '@/lib/prisma'

export async function GET() {
  const blockedDates = await prisma.blockedDates.findMany({
    orderBy: {
      date: 'asc',
    },
  })

  return Response.json(blockedDates)
}
