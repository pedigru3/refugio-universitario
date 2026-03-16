'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const dateSchema = z.object({
  date: z.string().min(4),
})

type DateFormInput = z.input<typeof dateSchema>

import { useEffect, useState } from 'react'
import { Trash } from '@phosphor-icons/react'
import dayjs from 'dayjs'

export default function BlockedDays() {
  const [blockedDates, setBlockedDates] = useState<{ id: string, date: string }[]>([])
  const { handleSubmit, register, reset } = useForm<DateFormInput>({
    resolver: zodResolver(dateSchema),
  })

  async function fetchBlockedDates() {
    const response = await fetch('/api/v1/blocked-dates/manual')
    if (response.ok) {
      const data = await response.json()
      setBlockedDates(data)
    }
  }

  useEffect(() => {
    fetchBlockedDates()
  }, [])

  async function handleSelectBlockDate(data: DateFormInput) {
    const response = await fetch('/api/v1/blocked-dates', {
      method: 'POST',
      body: JSON.stringify({ date: data.date }),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
      alert('Data bloqueada com sucesso!')
      reset()
      fetchBlockedDates()
    }
  }

  async function handleDeleteBlockDate(date: string) {
    const response = await fetch('/api/v1/blocked-dates', {
      method: 'DELETE',
      body: JSON.stringify({ date }),
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
      fetchBlockedDates()
    }
  }

  return (
    <Container>
      <div className="max-w-[400px] mt-10 space-y-6">
        <form onSubmit={handleSubmit(handleSelectBlockDate)}>
          <div className="border border-white/10 p-6 rounded-2xl bg-white/5 backdrop-blur">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold text-white">Bloquear nova data</p>
              <input
                className="block text-black bg-white border border-white/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 transition"
                type="date"
                {...register('date')}
              />
              <Button type="submit">Bloquear</Button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <p className="text-lg font-bold text-white mt-10">Datas bloqueadas</p>
          <div className="space-y-2">
            {blockedDates.length === 0 && <p className="text-zinc-500">Nenhuma data bloqueada.</p>}
            {blockedDates.map((block) => (
              <div key={block.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-zinc-300">{dayjs(block.date).format('DD/MM/YYYY')}</span>
                <button
                  onClick={() => handleDeleteBlockDate(block.date)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
