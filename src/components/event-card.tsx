'use client'

import Image from 'next/image'
import Link from 'next/link'
import dayjs from '@/lib/dayjs'
import { CalendarBlank, CaretRight, Clock } from '@phosphor-icons/react'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: Date | string
    image_url: string | null
    description?: string | null
  }
}

export function EventCard({ event }: EventCardProps) {
  const dateObj = dayjs.utc(event.date)
  const day = dateObj.date()
  const month = dateObj.format('MMM').toUpperCase().replace('.', '')
  const time = dateObj.format('HH[h]mm')

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-zinc-100 h-full">
      {/* Imagem do Evento */}
      <div className="relative h-48 w-full overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
             <CalendarBlank size={48} weight="fill" className="text-white/30" />
          </div>
        )}
        
        {/* Badge de Data Flutuante */}
        <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-xl bg-white/90 px-3 py-1.5 backdrop-blur-sm shadow-sm border border-white/20">
          <span className="text-xl font-bold leading-none text-purple-700">{day}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">{month}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <Clock size={14} className="text-purple-500" />
          <span>{time}</span>
        </div>
        
        <h3 className="mb-2 text-lg font-bold leading-tight text-zinc-900 group-hover:text-purple-700 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="mb-4 text-sm text-zinc-600 line-clamp-2 italic">
            {event.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            href={`/evento/${event.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Saber mais
            <CaretRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
