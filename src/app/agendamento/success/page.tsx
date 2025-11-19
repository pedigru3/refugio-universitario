import { Container } from '@/components/container'
import { Title } from '@/components/title'
import Image from 'next/image'
import Link from 'next/link'

export default function Success() {
  return (
    <Container>
      <Title color="light" type="h2">
        Agendamento
      </Title>
      <div className="max-w-2xl">
        <div className="md:hidden flex justify-center items-center">
          <Image
            className="my-10"
            src={'/students2.svg'}
            alt="Estudantes do Refúgio Universitário"
            width={300}
            height={300}
          />
        </div>
        <div className="hidden md:flex justify-center items-center">
          <Image
            className="my-10"
            src={'/students2.svg'}
            alt="Estudantes do Refúgio Universitário"
            width={600}
            height={600}
          />
        </div>
        <p className="leading-6 text-center text-lg pb-3">
          Seu agendamento foi realizado com sucesso!
        </p>
        <p className="text-center">
          <span className="text-red-400 font-bold">Atenção:</span> Caso não seja
          possível o comparecimento,
        </p>
        <p className="text-center">cancele o agendamento no seu perfil.</p>
        <div className="mt-10 flex justify-center items-center">
          <Link
            className="w-full justify-center text-center text-lg p-2 rounded-lg bg-blue-900"
            href={'/profile'}
          >
            Ver agendamentos
          </Link>
        </div>
      </div>
    </Container>
  )
}
