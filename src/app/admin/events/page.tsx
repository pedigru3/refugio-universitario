import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/button'
import dayjs from '@/lib/dayjs'

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    redirect('/')
  }

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  })

  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">Eventos</Title>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/admin/events/new">
            <Button className="!mt-0 p-2 rounded-lg w-full max-w-[200px]">Criar novo evento</Button>
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl bg-white/80 shadow-lg">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-zinc-50 text-xs uppercase text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3">Título</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Inscrições</th>
                <th scope="col" className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              )}
              {events.map((event) => {
                const totalRegs = event._count.registrations
                const max = event.max_capacity
                const isFull = totalRegs >= max

                return (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-purple-50/40 bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4">
                      {dayjs.utc(event.date).format('DD/MM/YYYY HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        isFull 
                          ? 'bg-red-50 text-red-700 ring-1 ring-red-200' 
                          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      }`}>
                        {totalRegs} / {max}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <Link
                        href={`/evento/${event.id}`}
                        target="_blank"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Página Pública
                      </Link>
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Ver Detalhes / Alterar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  )
}
