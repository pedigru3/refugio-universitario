import { prisma } from '@/lib/prisma'

export async function GET() {
  const updatedAt = new Date().toISOString()

  const fetchResponse = (await prisma.$queryRaw`
    SELECT
    (SELECT version()) AS version,
    (SELECT current_setting('max_connections')) AS max_connections,
    (SELECT count(*) FROM pg_stat_activity) AS opened_connections;
  `) as any

  const openedConnections = Number(fetchResponse[0].opened_connections)

  const maxConnections = fetchResponse[0].max_connections

  const version = fetchResponse[0].version.split(' ', 2)[1]

  return Response.json({
    updated_at: updatedAt,
    dependences: {
      database: {
        max_connections: Number(maxConnections),
        opened_connections: openedConnections,
        version,
      },
    },
  })
}
