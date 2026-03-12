'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import Input from '@/components/input'
import { courses } from '@/consts/courses'
import { educationLevels } from '@/consts/education-levels'
import { FormAnnotation } from '@/components/form-annotation'
import { DialogComponent } from '@/components/dialog'

const createUserSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido.' }).toLowerCase(),
  course: z.string().min(1, { message: 'O curso é obrigatório' }),
  education_level: z.string().min(1, { message: 'O nível de escolaridade é obrigatório' }),
  role: z.string().min(1, { message: 'O nível de acesso é obrigatório' }),
  cellphone: z.string().optional(),
  birthday: z.string().optional(),
  isActive: z.boolean().optional(),
})

type CreateUserData = z.infer<typeof createUserSchema>

const courseOptions = courses.map((course) => ({
  value: course,
  label: course,
}))

const educationOptions = educationLevels.map((level) => ({
  value: level,
  label: level,
}))

export function CreateUserForm() {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const router = useRouter()
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      isActive: true,
    },
  })

  async function handleCreateUser(data: CreateUserData) {
    console.log('Form data:', data)
    try {
      const payload = {
        ...data,
        cellphone: data.cellphone?.trim() || undefined,
        birthday: data.birthday || undefined,
        isActive: data.isActive ?? true,
      }

      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('API response:', response)

      if (response.ok) {
        setIsAlertOpen(true)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
      }
    } catch (error) {
      console.error('Fetch Error:', error)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleCreateUser)}
        className="mt-6 flex flex-col gap-4"
      >
        <Input placeholder="Nome" register={register('name')} />
        <FormAnnotation annotation={errors.name?.message} />

        <Input placeholder="E-mail" register={register('email')} />
        <FormAnnotation annotation={errors.email?.message} />

        <label className="mt-2 text-sm font-medium text-zinc-200">
          Curso
        </label>
        <select
          {...register('course')}
          className="h-12 w-full rounded-md bg-white px-4 text-black outline-none focus:ring-2 focus:ring-purple-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione o curso
          </option>
          {courseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FormAnnotation annotation={errors.course?.message} />

        <label className="mt-2 text-sm font-medium text-zinc-200">
          Nível de escolaridade
        </label>
        <select
          {...register('education_level')}
          className="h-12 w-full rounded-md bg-white px-4 text-black outline-none focus:ring-2 focus:ring-purple-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione o nível
          </option>
          {educationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FormAnnotation annotation={errors.education_level?.message} />

        <label className="mt-2 text-sm font-medium text-zinc-200">
          Nível de acesso
        </label>
        <select
          {...register('role')}
          className="h-12 w-full rounded-md bg-white px-4 text-black outline-none focus:ring-2 focus:ring-purple-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione o nível de acesso
          </option>
          <option value="admin">Administrador</option>
          <option value="user">Usuário</option>
        </select>
        <FormAnnotation annotation={errors.role?.message} />

        <Input
          placeholder="Celular (opcional)"
          register={register('cellphone')}
        />
        <FormAnnotation annotation={errors.cellphone?.message} />

        <label className="text-sm font-medium text-zinc-200">
          Data de aniversário (opcional)
        </label>
        <Input
          type="date"
          register={register('birthday')}
          className="text-black"
        />
        <FormAnnotation annotation={errors.birthday?.message} />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <>
              <label className="mt-2 text-sm font-medium text-zinc-200">
                Status do usuário
              </label>
              <select
                value={field.value ? 'true' : 'false'}
                onChange={(event) => field.onChange(event.target.value === 'true')}
                className="h-12 w-full rounded-md bg-white px-4 text-black outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              <FormAnnotation annotation={errors.isActive?.message} />
            </>
          )}
        />

        <FormAnnotation>
          O usuário receberá um e-mail para confirmar sua conta.
        </FormAnnotation>

        <Button isLoading={isSubmitting} type="submit">
          Criar usuário
        </Button>
      </form>
      <DialogComponent
        message="Usuário criado com sucesso!"
        isOpen={isAlertOpen}
        onOpenChange={() => router.push('/admin/users')}
        onClose={() => setIsAlertOpen(false)}
      />
    </>
  )
}
