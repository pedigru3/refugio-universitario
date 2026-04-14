'use client'

import { useForm } from 'react-hook-form'
import Input from './input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomSelect } from './custom-select'
import { courses } from '@/consts/courses'
import { educationLevels } from '@/consts/education-levels'
import { FormAnnotation } from './form-annotation'

import { useRouter, redirect, useSearchParams } from 'next/navigation'
import { Button } from './button'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const signUpFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter ao menos 3 letras' }),
  cellphone: z.string().min(10, { message: 'Celular inválido' }),
  course: z.string().min(3, { message: 'É preciso selecionar uma opção' }),
  education_level: z.string().min(3, { message: 'É preciso selecionar uma opção' }),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUpForm() {
  const session = useSession()
  const isSignIn = session.status === 'authenticated'
  if (isSignIn) {
    redirect('/profile')
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
      education_level: '',
    },
  })

  const router = useRouter()
  const searchParams = useSearchParams()


  async function handlePreRegister(data: SignUpFormData) {
    try {
      const result = await fetch(`/api/v1/users`, {
        method: 'post',
        body: JSON.stringify({
          name: data.name,
          cellphone: data.cellphone,
          course: data.course,
          education_level: data.education_level,
        }),
      })
      if (result.ok) {
        const callbackUrl = searchParams.get('callbackUrl')
        router.push(`/signup/connect-google${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`)
      } else {
        const message = await result.json()
        setErrorRequest(message.error)
      }
    } catch (error) {}
  }

  function handleOptionLevel(value: string) {
    setValue('education_level', value)
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
      <Input placeholder="Celular" register={register('cellphone')} />
      <FormAnnotation annotation={errors.cellphone?.message} />
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
        value={watch('education_level')}
        onChange={handleOptionLevel}
      />
      <FormAnnotation annotation={errors.education_level?.message} />
      <FormAnnotation annotation={errorResquest} />

      <Button isLoading={isSubmitting} type="submit">
        Próximo passo
      </Button>
    </form>
  )
}
