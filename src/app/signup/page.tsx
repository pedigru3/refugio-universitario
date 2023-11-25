'use client'

import { SignUpForm } from '@/components/signup-form'
import { signIn } from 'next-auth/react'

export default function SignUp() {
  async function handleSignIn() {
    await signIn('google')
  }

  return (
    <div>
      <SignUpForm />
      <button
        className="border-b-2 border-yellow-200 text-yellow-200 flex 
        mx-auto mt-5 justify-center items-center"
        onClick={handleSignIn}
      >
        Já tem uma conta? Entrar.
      </button>
    </div>
  )
}
