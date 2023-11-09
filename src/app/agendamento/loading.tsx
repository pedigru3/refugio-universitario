'use client'

import { Container } from '@/components/container'
import { CircleNotch } from '@phosphor-icons/react'

export default function LoadingPage() {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <CircleNotch size={32} className="animate-spin " />
      </div>
    </Container>
  )
}
