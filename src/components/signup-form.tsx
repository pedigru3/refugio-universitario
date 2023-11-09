'use client'

import { useForm } from 'react-hook-form'
import Input from './input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomSelect } from './custom-select'
import { courses } from '@/consts/courses'
import { FormAnnotation } from './form-annotation'

import { useRouter, redirect } from 'next/navigation'
import { Button } from './button'
import { useSession } from 'next-auth/react'

const signUpFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter ao menos 3 letras' }),
  username: z
    .string()
    .min(3, { message: 'O usuário deve ter ao menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hífens',
    })
    .transform((username) => username.toLowerCase()),
  course: z
    .string({ required_error: 'É preciso selecionar uma opção' })
    .min(3, { message: 'É preciso selecionar uma opção' }),
  educationLevel: z
    .string({ required_error: 'É preciso selecionar uma opção' })
    .min(3, { message: 'É preciso selecionar uma opção' }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUpForm() {
  const session = useSession()
  const isSignIn = session.status === 'authenticated'
  if (isSignIn) {
    redirect('/agendamento/calendario')
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })

  const router = useRouter()

  const educationLevels: string[] = [
    'Fundamental - Incompleto',
    'Fundamental - Completo',
    'Médio - Incompleto',
    'Médio - Completo',
    'Superior - Incompleto',
    'Superior - Completo',
    'Pós-graduação - Incompleto',
    'Pós-graduação - Completo',
    'Mestrado - Incompleto',
    'Mestrado - Completo',
    'Doutorado - Incompleto',
    'Doutorado - Completo',
  ]

  async function handlePreRegister(data: SignUpFormData) {
    try {
      const result = await fetch(`/api/v1/users`, {
        method: 'post',
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          course: data.course,
          educationLevel: data.educationLevel,
        }),
      })
      if (result.ok) {
        router.push('/signup/connect-google')
      }
    } catch (error) {}
  }

  function handleOptionLevel(value: string) {
    setValue('educationLevel', value)
  }

  function handleCourseOption(value: string) {
    setValue('course', value)
  }

  return (
    <form
      className="relative flex flex-col justify-center items-center max-w-2xl"
      onSubmit={handleSubmit(handlePreRegister)}
    >
      <Input placeholder="Nome" register={register('name')} />
      <FormAnnotation annotation={errors.name?.message} />
      <Input placeholder="Usuário" register={register('username')} />
      <FormAnnotation annotation={errors.username?.message} />
      <CustomSelect
        textDefault="Curso ou área de interesse"
        handleOptionClick={handleCourseOption}
        options={courses}
      />
      <FormAnnotation annotation={errors.course?.message} />
      <CustomSelect
        textDefault="Nível de escolaridade"
        handleOptionClick={handleOptionLevel}
        options={educationLevels}
      />
      <FormAnnotation annotation={errors.educationLevel?.message} />

      <Button type="submit">Próximo passo</Button>
    </form>
  )
}
