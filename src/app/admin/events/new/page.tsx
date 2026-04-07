import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/button'
import dayjs from '@/lib/dayjs'

async function createEvent(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const dateStr = formData.get('date') as string
  const maxCapacity = Number(formData.get('max_capacity'))

  if (!title || !dateStr || !maxCapacity) {
    throw new Error('Preencha os campos obrigatórios')
  }

  const date = dayjs.utc(dateStr).toDate()

  await prisma.event.create({
    data: {
      title,
      description,
      image_url: image_url || null,
      date,
      max_capacity: maxCapacity,
    }
  })

  redirect('/admin/events')
}

export default async function NewEventPage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">Criar Novo Evento</Title>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl">
          <form action={createEvent} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Título do Evento *</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                required
                className="h-11 rounded-lg border px-3 text-black" 
                placeholder="Ex: Noite de Jogos com Pizza"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea 
                name="description" 
                id="description" 
                className="rounded-lg border px-3 py-2 min-h-[100px] text-black" 
                placeholder="Detalhes opcionais sobre o evento..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="image_url" className="text-sm font-medium text-gray-700">Link da Imagem (URL)</label>
              <input 
                type="url" 
                name="image_url" 
                id="image_url" 
                className="h-11 rounded-lg border px-3 text-black" 
                placeholder="Ex: https://meusite.com/imagem.png"
              />
              <span className="text-xs text-gray-500">Deixe em branco se não tiver imagem. Recomendamos links terminados em .jpg/.png</span>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Data e Hora *</label>
              <input 
                type="datetime-local" 
                name="date" 
                id="date" 
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
                defaultValue={20}
                required
                min={1}
                className="h-11 rounded-lg border px-3 text-black" 
              />
            </div>

            <Button type="submit" className="mt-4">
              Criar Evento
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
