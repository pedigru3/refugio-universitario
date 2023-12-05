import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const isAuth = session?.user.role === 'admin'

  if (isAuth) {
    return <div>Olá</div>
  } else {
    redirect('/')
  }
}
