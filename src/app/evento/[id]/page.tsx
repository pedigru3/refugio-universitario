import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EventContent from './event-content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id }
  })

  if (!event) {
    return {
      title: 'Evento não encontrado | Refúgio Universitário',
    }
  }

  return {
    title: `${event.title} | Refúgio Universitário`,
    description: event.description?.substring(0, 160) || 'Participe do nosso próximo evento no Refúgio Universitário.',
    openGraph: {
      title: event.title,
      description: event.description || 'Lugar de acolhimento e uma possiblidade de família',
      images: event.image_url ? [event.image_url] : ['/refugio-universitario.png'],
      type: 'website',
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        select: {
          user_id: true,
        }
      }
    }
  })

  if (!event) {
    notFound()
  }

  const registrationsCount = event.registrations.length
  const isFull = registrationsCount >= event.max_capacity
  
  const isRegistered = session?.user ? event.registrations.some(
    (reg) => reg.user_id === session.user.id
  ) : false

  const eventData = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    imageUrl: event.image_url,
    maxCapacity: event.max_capacity,
    isFull,
  }

  const userData = {
    isRegistered,
    hasCellphone: session?.user ? !!session.user.cellphone : false
  }

  // JSON-LD for Event Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date.toISOString(),
    description: event.description,
    image: event.image_url || 'https://refugiouniversitario.com.br/refugio-universitario.png',
    location: {
      '@type': 'Place',
      name: 'Refúgio Universitário',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'R. Rubéns Ávila, 150',
        addressLocality: 'Londrina',
        addressRegion: 'PR',
        postalCode: '86051-400',
        addressCountry: 'BR'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'Refúgio Universitário',
      url: 'https://refugiouniversitario.com.br'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventContent 
        id={id} 
        initialEventData={eventData} 
        initialUserData={userData} 
      />
    </>
  )
}
