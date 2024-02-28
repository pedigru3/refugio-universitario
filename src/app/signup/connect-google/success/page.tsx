'use client'

import { Button } from '@/components/button'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SuccessSignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const session = useSession()
  const router = useRouter()

  if (!session.data?.user) {
    redirect('/signup')
  }

  if (session.data?.user) {
    return (
      <div className="mt-10">
        <p>
          Sucesso,
          <span className="font-medium">
            {session.data?.user?.name?.split(' ', 1)}!
          </span>
        </p>
        <p className="pt-2 leading-relaxed">
          Seja muito bem-vindo ao Refúgio Universitário. Agora é só você marcar
          a melhor data para iniciar os seus estudos.
        </p>
        <div className="mt-5 max-w-[540px]"></div>
        <Button
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true)
            router.push('/schedules')
          }}
        >
          Marcar horário
        </Button>
      </div>
    )
  }
}
