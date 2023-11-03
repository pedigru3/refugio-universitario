import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/options'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <h1>Olá, mundo</h1>
    </main>
  )
}
