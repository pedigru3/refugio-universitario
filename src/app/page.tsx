import Image from 'next/image'
import { Container } from '@/components/container'
import { Header } from '@/components/header'
import Link from 'next/link'

export default async function Home() {
  return (
    <>
      <div className="bg-gradient-to-tr from-purple-900 via-purple-700 to-purple-400 min-h-[720px] w-full">
        <Header />
        <div className="flex flex-col justify-center md:flex-row">
          <figure className="flex w-full justify-center self-center p-5 md:order-2">
            <Image
              className="wp-full md:mr-20"
              src={'/refugio-universitario.png'}
              width={600}
              height={300}
              alt="Ilustração de estudantes no Refúgio Universitário"
            />
          </figure>
          <Container>
            <h1 className="text-3xl md:text-6xl py-3 text-white">
              Refúgio universitário
            </h1>
            <p className="py-1 leading-relaxed text-white">
              Um ambiente onde universitários são acolhidos e apoiados em suas
              jornadas acadêmicas.
            </p>
            <div className="mt-8 py-2 text-black text-lg font-medium bg-yellow-400 rounded-3xl inline-block">
              <Link className="px-8 py-2" href="/agendamento">
                Inscreva-se grátis
              </Link>
            </div>
          </Container>
        </div>
      </div>
      <main className=""></main>
    </>
  )
}
