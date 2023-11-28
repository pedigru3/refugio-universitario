'use client'

import { Container } from '@/components/container'
import { Header } from '@/components/header'
import { Title } from '@/components/title'

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
        <Container>
          <Title color="light" type="h2">
            Agendamento
          </Title>
        </Container>
        {children}
      </div>
    </div>
  )
}
