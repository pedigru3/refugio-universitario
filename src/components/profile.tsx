'use client'

import { SignOut } from '@phosphor-icons/react'
import { signOut, useSession } from 'next-auth/react'

export function Profile() {
  function handleSignOut() {
    signOut()
  }

  const session = useSession()

  const getGreetingByTime = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 5 && hour < 12) {
      return 'Bom dia'
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde'
    } else {
      return 'Boa noite'
    }
  }

  return (
    <div className="flex justify-between mb-5">
      <p>
        {getGreetingByTime()}, {session.data?.user?.name?.split(' ', 1)}!
      </p>
      <button
        className="flex justify-center items-center gap-3 text-yellow-200"
        onClick={handleSignOut}
      >
        sair
        <SignOut />
      </button>
    </div>
  )
}
