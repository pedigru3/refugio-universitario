'use client'

import { Calendar } from '@/components/calendar/calendar'
import { Container } from '@/components/container'
import { useSession } from 'next-auth/react'

export default function SuccessSignUp() {
  const session = useSession()
  return (
    <div className="mt-10">
      <p>
        Sucesso,{' '}
        <span className="font-medium">
          {' '}
          {session.data?.user?.name?.split(' ', 1)}!
        </span>
      </p>
      <p className="pt-2 leading-relaxed">
        Seja muito bem-vindo ao Refúgio Universitário. Agora é só você marcar a
        melhor data para iniciar os seus estudos.
      </p>
      <div className="mt-5 max-w-[540px]"></div>
    </div>
  )
}
