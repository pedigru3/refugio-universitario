'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarBlank, Ticket, XCircle } from '@phosphor-icons/react'

export function MyEvents() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchRegistrations() {
    try {
      const response = await fetch('/api/events/my-registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições de eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function handleCancel(eventId: string) {
    if (!confirm('Tem certeza que deseja cancelar sua presença neste evento? Você perderá a vaga.')) {
      return
    }

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Sua inscrição foi cancelada.')
        // Refresh
        setIsLoading(true)
        fetchRegistrations()
      } else {
        const err = await res.json()
        alert(err.error || 'Não foi possível cancelar a inscrição.')
      }
    } catch {
      alert('Erro de conexão.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center mt-4">
        <p className="mb-4 text-zinc-400">Você ainda não se inscreveu em nenhum evento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {registrations.map((reg) => {
        const event = reg.event
        return (
          <div
            key={reg.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-3">
                <Ticket size={24} weight="bold" className="text-orange-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate text-lg">{event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                  <CalendarBlank size={16} />
                  <span>{new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
               <Link 
                 href={`/evento/${event.id}`}
                 className="px-4 py-2 bg-white/10 rounded-lg text-sm text-white font-medium hover:bg-white/20 transition-colors"
               >
                 Ver Evento
               </Link>
               <button 
                 onClick={() => handleCancel(event.id)}
                 className="flex items-center gap-1 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
               >
                 <XCircle size={16} weight="bold" />
                 Cancelar
               </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
