'use client'

import { SignUpForm } from '@/components/signup-form'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FormAnnotation } from '@/components/form-annotation'
import { useState, useEffect } from 'react'

export default function SignUp() {
  const [showForm, setShowForm] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'unregistered') {
      setShowForm(true)
    }
  }, [error])

  async function handleSignIn() {
    try {
      await signIn('google')
    } catch (error) {
      console.log(error)
      throw Error('erro')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
      <div className="w-full max-w-[440px]">
        {!showForm ? (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-white mb-3">Bem-vindo ao Refúgio!</h1>
              <p className="text-zinc-400 text-lg">
                Gerencie seus agendamentos e estudos em um só lugar.
              </p>
            </div>

            <button
              id="google-signin-btn"
              onClick={handleSignIn}
              className="w-full bg-white px-6 py-4 flex justify-center items-center gap-4
               border border-slate-200 rounded-xl shadow-sm
                text-slate-700 hover:bg-slate-50 hover:shadow-md transition duration-200"
            >
              <Image
                width={24}
                height={24}
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span className="text-lg font-bold">Entrar com Google</span>
            </button>

            <div className="flex flex-col items-center gap-3 mt-4">
              <span className="text-zinc-500">Novo por aqui?</span>
              <button
                id="show-signup-form-btn"
                onClick={() => setShowForm(true)}
                className="text-emerald-400 hover:text-emerald-300 font-bold text-lg underline underline-offset-4 transition"
              >
                Não tenho cadastro
              </button>
            </div>

            {error === 'unregistered' && (
              <div className="mt-6 w-full text-center">
                <FormAnnotation annotation="E-mail não cadastrado. Por favor, clique em 'Não tenho cadastro' para criar sua conta primeiro." />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {error === 'unregistered' && (
              <div className="w-full bg-amber-500/10 border border-amber-500/50 p-6 rounded-2xl text-center flex flex-col gap-3">
                <span className="text-amber-500 font-black text-xl flex items-center justify-center gap-2">
                  <span>⚠️</span> E-MAIL NÃO ENCONTRADO
                </span>
                <p className="text-zinc-200 text-base leading-relaxed">
                  Identificamos que seu e-mail do Google ainda não possui um cadastro no Refúgio.
                  <br />
                  <strong className="text-white">Preencha os campos abaixo de forma rápida</strong> para criar sua conta e liberar o acesso!
                </p>
              </div>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Criar nova conta</h2>
              <p className="text-zinc-400 mt-2">Preencha os dados abaixo para começar.</p>
            </div>

            <SignUpForm />

            <button
              onClick={() => setShowForm(false)}
              className="text-zinc-500 hover:text-white transition font-medium"
            >
              Já tem conta? Clique aqui para entrar.
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
