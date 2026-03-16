import { Metadata } from 'next'
import { IntervalForm } from './interval-form'
import { Container } from '@/components/container'
import { SystemStatusToggle } from './system-status-toggle'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function AdminPage() {
  return (
    <div className="pb-10">
      <Container>
        <div className="grid  lg:gap-5 mt-10">
          <SystemStatusToggle />
          <IntervalForm />
        </div>
      </Container>
    </div>
  )
}
