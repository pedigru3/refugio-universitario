import { Metadata } from 'next'
import { IntervalForm } from './interval-form'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function AdminPage() {
  return (
    <div className="pb-10">
      <Container>
        <div className="grid gird-cols-1 lg:grid-cols-2 lg:gap-5">
          <IntervalForm />
        </div>
      </Container>
    </div>
  )
}
