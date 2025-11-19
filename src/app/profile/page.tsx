'use client'

import { Container } from '@/components/container'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { MyAppointments } from './my-appointments'
import { Loading } from '@/components/loading'

export default function Profile() {
  const { data: session, status } = useSession({ required: true })

  async function handleSignOut() {
    await signOut({
      callbackUrl: '/',
    })
  }

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <Container>
      <div className="mt-10 flex items-center gap-5">
        <Image
          src={session?.user.image ?? ''}
          width={55}
          height={55}
          alt="image user"
          className="rounded-full"
        />
        <div>
          <p className="text-xl font-bold">{session?.user.name}</p>
          <p className="text-lg font-light">
            {session?.user.username}
            {' ('}
            <button className="underline" onClick={() => handleSignOut()}>
              sair
            </button>
            {') '}
          </p>
        </div>
      </div>
      <div className="mt-10 border rounded-md py-2 px-4">
        <p>{session?.user.education_level} </p>
        <p className="border-t mt-2 pt-2">{session?.user.course}</p>
      </div>
      <div className="mt-10 pb-10">
        <h3 className="text-2xl font-bold mb-5">Minhas reservas</h3>
        <MyAppointments />
      </div>
    </Container>
  )
}
