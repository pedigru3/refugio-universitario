import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/context/authprovider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Visão Teológica',
  description: 'Olhando para o mundo com uma visão de Deus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>

  )
}
