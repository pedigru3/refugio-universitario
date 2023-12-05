import '../lib/dayjs'

import type { Metadata } from 'next'

import './globals.css'

import AuthProvider from '@/context/authprovider'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/options'

import { inter, plusJakartaSans } from './fonts'

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
    <html className="bg-blue-950" lang="pt-br">
      <body className={`${inter.className} ${plusJakartaSans.variable}`}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  )
}
