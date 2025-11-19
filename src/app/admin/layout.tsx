import { ReactNode } from 'react'
import { MenuAdmin } from './components/menu'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { Container } from '@/components/container'
import { Title } from '@/components/title'
import Image from 'next/image'
import Link from 'next/link'

export default async function LayouyAdmin({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)
  const isAuth = session?.user.role === 'admin'

  if (isAuth) {
    return (
      <div className="flex min-h-screen">
        <div className="min-w-[250px] bg-purple-900 shadow-sm">
          <MenuAdmin />
        </div>
        <div className="bg-purple-800 w-full">{children}</div>
      </div>
    )
  } else {
    return (
      <div className="flex h-screen">
        <div className="min-w-[250px] bg-purple-900 shadow-sm">
          <div className="mx-5 flex mt-5">
            <Link href="/">
              <Image
                src={'/refugio-logo.png'}
                width={100}
                height={100}
                alt="Refúgio Universitário"
              />
            </Link>
          </div>
        </div>
        <div className="bg-purple-800 w-full">
          <Container>
            <div className="mt-10">
              <Title type={'h2'} color={'light'}>
                Área administrativa
              </Title>
              <p className="mt-5">
                Apenas administradores podem acessar. Verifique suas permissões
                de acesso e tente novamente.
              </p>
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
