import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { IntervalForm } from './interval-form'
import { TableForm } from './table-form'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const isAuth = session?.user.role === 'admin'

  if (isAuth) {
    return (
      <div className="pb-10">
        <Container>
          <div className="grid gird-cols-1 lg:grid-cols-2 lg:gap-5">
            <IntervalForm />
          </div>
        </Container>
      </div>
    )
  } else {
    redirect('/')
  }
}
