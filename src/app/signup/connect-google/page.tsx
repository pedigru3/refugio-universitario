'use client'

import { Button } from '@/components/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FormAnnotation } from '@/components/form-annotation'
import { Check } from '@phosphor-icons/react'
import { useState } from 'react'

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()
  const session = useSession()
  const searchParams = useSearchParams()

  const hasError =
    session.status === 'unauthenticated' && !!searchParams.get('error')
  const isSignIn = session.status === 'authenticated'

  return (
    <>
      {isSignIn ? (
        <Button disabled>
          Conectado
          <Check />
        </Button>
      ) : (
        <Button
          isLoading={googleLoading}
          onClick={async () => {
            setGoogleLoading(true)
            await signIn('google')
          }}
        >
          {'Conectar ao Google Calendar ->'}
        </Button>
      )}
      {hasError && (
        <FormAnnotation annotation="Não foi possível se conectar ao Google. Todas as permissões foram aceitas?" />
      )}
      <Button
        disabled={!isSignIn}
        isLoading={isLoading}
        onClick={() => {
          setIsLoading(true)
          router.push('/signup/connect-google/success')
        }}
      >
        Finalizar
      </Button>
    </>
  )
}
