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
import { useState } from 'react'

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
    .string()
    .min(3, { message: 'É preciso selecionar uma opção' }),
  educationLevel: z
    .string()
    .min(3, { message: 'É preciso selecionar uma opção' }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUpForm() {
  const session = useSession()
  const isSignIn = session.status === 'authenticated'
  if (isSignIn) {
    redirect('/schedules')
  }

  const [errorResquest, setErrorRequest] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      course: '',
      educationLevel: '',
    },
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
      } else {
        const message = await result.json()
        setErrorRequest(message.error)
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
        placeholder="Curso ou área de interesse"
        options={courses.map((course) => ({ value: course, label: course }))}
        value={watch('course')}
        onChange={handleCourseOption}
      />
      <FormAnnotation annotation={errors.course?.message} />
      <CustomSelect
        placeholder="Nível de escolaridade"
        options={educationLevels.map((level) => ({ value: level, label: level }))}
        value={watch('educationLevel')}
        onChange={handleOptionLevel}
      />
      <FormAnnotation annotation={errors.educationLevel?.message} />
      <FormAnnotation annotation={errorResquest} />

      <Button isLoading={isSubmitting} type="submit">
        Próximo passo
      </Button>
    </form>
  )
}
