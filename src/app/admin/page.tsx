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
        <div className="grid gird-cols-1 lg:grid-cols-1 lg:gap-5 mt-10">
          <SystemStatusToggle />
        </div>
      </Container>
    </div>
  )
}
