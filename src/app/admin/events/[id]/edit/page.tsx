import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/button'
import Link from 'next/link'
import dayjs from 'dayjs'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    redirect('/')
  }

  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id }
  })

  if (!event) {
    return (
      <Container>
         <div className="py-20 text-center text-red-600">Evento não encontrado.</div>
      </Container>
    )
  }

  async function updateEvent(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const dateStr = formData.get('date') as string
    const maxCapacity = Number(formData.get('max_capacity'))

    if (!title || !dateStr || !maxCapacity) {
      throw new Error('Preencha os campos obrigatórios')
    }

    const date = new Date(dateStr)

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        image_url: image_url || null,
        date,
        max_capacity: maxCapacity,
      }
    })

    redirect(`/admin/events/${id}`)
  }

  // Formatting date for datetime-local
  const dateForInput = dayjs(event.date).format('YYYY-MM-DDTHH:mm')

  return (
    <div className="mt-10 mb-20">
      <Container>
        <div className="mb-4">
          <Link href={`/admin/events/${event.id}`} className="text-sm font-medium text-purple-600 hover:underline">
            &larr; Voltar para detalhes do evento
          </Link>
        </div>

        <Title type="h2" color="light">Editar Evento</Title>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl">
          <form action={updateEvent} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Título do Evento *</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                defaultValue={event.title}
                required
                className="h-11 rounded-lg border px-3 text-black" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea 
                name="description" 
                id="description" 
                defaultValue={event.description || ''}
                className="rounded-lg border px-3 py-2 min-h-[100px] text-black" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="image_url" className="text-sm font-medium text-gray-700">Link da Imagem (URL)</label>
              <input 
                type="url" 
                name="image_url" 
                id="image_url" 
                defaultValue={event.image_url || ''}
                className="h-11 rounded-lg border px-3 text-black" 
                placeholder="Ex: https://meusite.com/imagem.png"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Data e Hora *</label>
              <input 
                type="datetime-local" 
                name="date" 
                id="date" 
                defaultValue={dateForInput}
                required
                className="h-11 rounded-lg border px-3 text-black" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="max_capacity" className="text-sm font-medium text-gray-700">Limite de vagas *</label>
              <input 
                type="number" 
                name="max_capacity" 
                id="max_capacity" 
                defaultValue={event.max_capacity}
                required
                min={1}
                className="h-11 rounded-lg border px-3 text-black" 
              />
            </div>

            <Button type="submit" className="mt-4">
              Salvar Alterações
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
