'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import Input from '@/components/input'
import { courses } from '@/consts/courses'
import { CustomSelect } from '@/components/custom-select'
import { FormAnnotation } from '@/components/form-annotation'
import { DialogComponent } from '@/components/dialog'

const createUserSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido.' }).toLowerCase(),
  course: z.string({ required_error: 'O curso é obrigatório' }),
  education_level: z.string({
    required_error: 'O nível de escolaridade é obrigatório',
  }),
  role: z.string({ required_error: 'O nível de acesso é obrigatório' }),
})

type CreateUserData = z.infer<typeof createUserSchema>

const courseOptions = courses.map((course) => ({
  value: course,
  label: course,
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
  })

  async function handleCreateUser(data: CreateUserData) {
    console.log('Form data:', data)
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        <Input
          placeholder="Nome"
          register={register('name')}
        />
        <FormAnnotation annotation={errors.name?.message} />

        <Input
          placeholder="E-mail"
          register={register('email')}
        />
        <FormAnnotation annotation={errors.email?.message} />

        <Controller
          name="course"
          control={control}
          render={({ field }) => (
            <>
              <CustomSelect
                placeholder="Selecione o curso"
                options={courseOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.course?.message}
              />
              <FormAnnotation annotation={errors.course?.message} />
            </>
          )}
        />

        <Controller
          name="education_level"
          control={control}
          render={({ field }) => (
            <>
              <CustomSelect
                placeholder="Selecione o nível de escolaridade"
                options={[
                  { value: 'Ensino Médio', label: 'Ensino Médio' },
                  { value: 'Graduação', label: 'Graduação' },
                  { value: 'Pós-graduação', label: 'Pós-graduação' },
                  { value: 'Mestrado', label: 'Mestrado' },
                  { value: 'Doutorado', label: 'Doutorado' },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.education_level?.message}
              />
              <FormAnnotation annotation={errors.education_level?.message} />
            </>
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <>
              <CustomSelect
                placeholder="Selecione o nível de acesso"
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'user', label: 'Usuário' },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
              <FormAnnotation annotation={errors.role?.message} />
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
