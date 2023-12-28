import '../lib/dayjs'

import type { Metadata } from 'next'

import './globals.css'

import AuthProvider from '@/context/authprovider'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/options'

import { inter, plusJakartaSans } from './fonts'

export const metadata: Metadata = {
  title: 'Refúgio Universitário',
  description: 'Lugar de acolhimento e uma possiblidade de família',
  openGraph: {
    url: 'https://refugiouniversitario.com.br',
    title: 'Refúgio Universitário',
    description: 'Lugar de acolhimento e uma possiblidade de família',
    images: ['https://refugiouniversitario.com.br/refugio-universitario.png'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html className="" lang="pt-br">
      <body className={`${inter.className} ${plusJakartaSans.variable}`}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  )
}
