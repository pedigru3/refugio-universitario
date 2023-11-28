'use client'

import { Header } from '@/components/header'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="bg-purple-700">
        <Header />
      </div>
      <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-400 w-full min-h-screen py-5">
        {children}
      </div>
    </div>
  )
}
