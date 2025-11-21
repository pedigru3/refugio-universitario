'use client'

import { SignUpForm } from '@/components/signup-form'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FormAnnotation } from '@/components/form-annotation'

export default function SignUp() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleSignIn() {
    try {
      await signIn('google')
    } catch (error) {
      console.log(error)
      throw Error('erro')
    }
  }

  return (
    <div>
      <SignUpForm />
      <div className="mt-10 flex flex-col items-center justify-center gap-2">
        Já é inscrito? Entre aqui:
        <button
          onClick={handleSignIn}
          className="bg-white px-3 py-[10px] border flex justify-center text-center items-center gap-[10px]
           border-slate-200 rounded-[4px]
            text-slate-700 hover:border-slate-400
             hover:text-slate-900
             hover:shadow transition duration-150"
        >
          <Image
            width={20}
            height={20}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span className="text-sm font-bold">Sign in with Google</span>
        </button>
        {error === 'unregistered' && (
          <FormAnnotation annotation="E-mail não cadastrado. Por favor, crie sua conta primeiro." />
        )}
      </div>
    </div>
  )
}
