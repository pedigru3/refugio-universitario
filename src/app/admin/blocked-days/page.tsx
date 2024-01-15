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

export default function BlockedDays() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<DateFormInput>({
    resolver: zodResolver(dateSchema),
  })

  function handleSelectBlockDate(data: any) {
    console.log(data)
  }

  return (
    <Container>
      <div className="max-w-[400px] mt-10">
        <form onSubmit={handleSubmit(handleSelectBlockDate)}>
          <div className="border p-4 rounded-md">
            <div className=" flex justify-between items-center">
              <p className="font-bold">Bloquear data</p>
              <input
                className=" block text-black min-w-[158px] rounded-lg px-2 py-1"
                type="date"
                {...register('date')}
              />
            </div>
            <Button>Bloquear</Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
