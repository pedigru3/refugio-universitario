'use client'

import { Header } from '@/components/header'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-purple-700 h-screen">
      <Header />
      <div className="bg-gradient-to-br min-h-full from-purple-900 via-purple-700 to-purple-400 w-full py-5">
        {children}
      </div>
    </div>
  )
}
