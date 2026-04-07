import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import dayjs from '@/lib/dayjs'

export default async function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    redirect('/')
  }

  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          user: true
        },
        orderBy: {
          created_at: 'asc'
        }
      }
    }
  })

  if (!event) {
    return (
      <Container>
        <div className="py-20 text-center text-red-600">
          Evento não encontrado.
        </div>
      </Container>
    )
  }

  return (
    <div className="mt-10">
      <Container>
        <div className="mb-4">
          <Link href="/admin/events" className="text-sm font-medium text-purple-600 hover:underline">
            &larr; Voltar para eventos
          </Link>
        </div>
        
        <Title type="h2" color="light">{event.title}</Title>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Informações Resumo */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-600 text-black">
                <h3 className="text-xl font-bold mb-4">Informações</h3>
                <p><strong>Data:</strong> {dayjs.utc(event.date).format('DD/MM/YYYY HH:mm')}</p>
                <p className="mt-2"><strong>Capacidade:</strong> {event.max_capacity} vagas</p>
                <p className="mt-2"><strong>Ocupadas:</strong> {event.registrations.length} vagas</p>
                <div className="mt-4 pt-4 border-t">
                  <a href={`/evento/${event.id}`} target="_blank" className="text-indigo-600 hover:underline text-sm block mb-2">
                    🔗 Acessar Link Público
                  </a>
                  <Link href={`/admin/events/${event.id}/edit`} className="text-purple-600 hover:underline text-sm block">
                    ✏️ Editar Detalhes do Evento
                  </Link>
                </div>
             </div>
          </div>

          {/* Lista de Registros */}
          <div className="w-full lg:w-2/3 text-black">
             <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold">Participantes Confirmados ({event.registrations.length})</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-zinc-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th scope="col" className="px-6 py-3">Nome / Email</th>
                        <th scope="col" className="px-6 py-3">Celular</th>
                        <th scope="col" className="px-6 py-3">Curso</th>
                        <th scope="col" className="px-6 py-3 text-right">Cadastrado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.registrations.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            Ninguém confirmou presença ainda.
                          </td>
                        </tr>
                      )}
                      {event.registrations.map((reg) => (
                        <tr key={reg.id} className="border-b last:border-0 hover:bg-zinc-50 bg-white">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {reg.user.name}
                            <p className="text-xs text-zinc-500">{reg.user.email}</p>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {reg.user.cellphone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="rounded-full bg-zinc-100 px-3 py-1">
                               {reg.user.course || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs">
                            {dayjs(reg.created_at).format('DD/MM/YYYY HH:mm')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
