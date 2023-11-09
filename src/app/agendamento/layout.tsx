'use client'

import { Header } from '@/components/header'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()
  const isSignIn = session.status === 'authenticated'

  if (!isSignIn) {
    redirect('/')
  }

  return (
    <div className="bg-purple-700 h-screen">
      <Header />
      <div className="bg-gradient-to-br min-h-full from-purple-900 via-purple-700 to-purple-400 w-full py-5">
        {children}
      </div>
    </div>
  )
}
