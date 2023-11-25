import '../lib/dayjs'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/context/authprovider'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/options'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Visão Teológica',
  description: 'Olhando para o mundo com uma visão de Deus',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  )
}
