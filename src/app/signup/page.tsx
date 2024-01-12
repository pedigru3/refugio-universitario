'use client'

import { SignUpForm } from '@/components/signup-form'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SignUp() {
  async function handleSignIn() {
    console.log('login google')
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
      </div>
    </div>
  )
}
