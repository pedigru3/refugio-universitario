'use client'
import { DialogComponent } from '@/components/dialog'
import { DialogConfirm } from '@/components/dialog-confirm'
import { FormAnnotation } from '@/components/form-annotation'
import { IntervalItem } from '@/components/intervals/interval-item'
import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from '@phosphor-icons/react'
import { Dialog } from '@radix-ui/react-dialog'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'

interface DataTables {
  tables: [
    {
      id: string
      table_name: string
      chair_count: number
    },
  ]
}

const tableFormSchema = z.object({
  table_name: z
    .string()
    .min(3, { message: 'O nome da mesa deve ter pelo menos 3 letras' }),
  chair_count: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value !== 0, {
      message: 'A quant. deve ser maior do que zero',
    }),
})

type TableFormInput = z.input<typeof tableFormSchema>
type TableFormOutput = z.output<typeof tableFormSchema>

export function TableForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const currentId = useRef('')

  const { data: dataTables, mutate } = useSWR<DataTables>(
    'tables',
    async () => {
      const response = await fetch('/api/v1/tables')
      const json = await response.json()
      return json
    },
  )

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<TableFormInput>({
    resolver: zodResolver(tableFormSchema),
  })

  async function handleAddTable(data: any) {
    const dataTable = data as TableFormOutput
    const body = JSON.stringify(dataTable)

    await fetch(`/api/v1/tables`, { method: 'POST', body })

    mutate()
  }

  async function handleRemoveTable(id: string) {
    await fetch(`/api/v1/tables?id=${id}`, {
      method: 'DELETE',
    })
    mutate()
  }

  return (
    <div className="mt-10 max-w-[600px]">
      <h2 className=" font-bold lg:mb-10 text-lg">Mesas Disponíveis</h2>
      <div className="border border-gray-400 rounded-md">
        {dataTables &&
          dataTables.tables.map((table) => (
            <IntervalItem key={table.id}>
              <p>{table.table_name}</p>
              <div className="flex">
                <p>Lugares:</p>
                <p className="pl-2">{table.chair_count}</p>
                <button
                  className="pl-3"
                  onClick={() => {
                    setIsDialogOpen(true)
                    currentId.current = table.id
                  }}
                >
                  <XCircle className="hover:text-amber-400" size={23} />
                </button>
              </div>
            </IntervalItem>
          ))}
      </div>
      <DialogConfirm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onOpenChange={setIsDialogOpen}
        description="Você está prestes a deletar de uma vez por todas uma mesa. Agendamentos realizados nela serão perdidos."
        onButtonResponse={(isOk) => {
          if (isOk) {
            handleRemoveTable(currentId.current)
          }
        }}
      />
      <div className="pt-4">
        <h2 className="my-2 font-bold lg:mb-5 text-lg">Adicionar Mesa</h2>
        <form
          onSubmit={handleSubmit(handleAddTable)}
          className="grid grid-cols-3 gap-2 border-l py-2 px-2"
        >
          <div className="flex flex-col gap-3">
            <label>Nome da mesa:</label>
            <input
              className=" bg-transparent border-b focus:outline-none"
              type="text"
              placeholder="Mesa Individual 1"
              {...register('table_name')}
            />
          </div>
          <div className="flex flex-col justify-stretch gap-3">
            <label className="flex">N de cadeiras:</label>
            <input
              className="block bg-transparent border-b focus:outline-none"
              type="text"
              placeholder="4"
              {...register('chair_count')}
            />
          </div>
          <button disabled={isSubmitting} className="bg-violet-500">
            Adicionar
          </button>
        </form>
        {errors.table_name && (
          <FormAnnotation annotation={errors.table_name.message} />
        )}
        {errors.chair_count && (
          <FormAnnotation annotation={errors.chair_count.message} />
        )}
      </div>
    </div>
  )
}
