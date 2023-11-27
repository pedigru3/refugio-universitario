import Image from 'next/image'
import { Container } from '@/components/container'
import { Header } from '@/components/header'
import Link from 'next/link'

import { BulletIcon } from '@/components/bullet-icon'

export default async function Home() {
  return (
    <>
      <div className="bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end min-h-[650px] w-full">
        <Header />
        <Container>
          <div className="flex flex-col justify-center md:flex-row lg:h-96 lg:mt-10">
            <figure className="flex w-full lg:w-1/2 justify-center self-center p-5 md:order-2">
              <Image
                className="wp-full md:mr-20"
                src={'/refugio-universitario.png'}
                width={600}
                height={300}
                alt="Ilustração de estudantes no Refúgio Universitário"
              />
            </figure>
            <div className="lg:w-1/2">
              <h1
                className={`font-plus-jakarta-sans font-semibold text-3xl leading-[1.2]  md:text-[4rem] py-3
                 text-white max-w-lg`}
              >
                Refúgio Universitário
              </h1>
              <p className="py-1 leading-7 text-white text-base md:text-lg font-light max-w-lg">
                Um ambiente onde universitários são acolhidos e apoiados em suas
                jornadas acadêmicas.
              </p>
              <div className="mt-8 py-2 md:py-4 md:px-4 text-black text-lg font-medium bg-yellow-400 rounded-3xl md:rounded-[2rem] inline-block">
                <Link
                  className="px-8 py-2 font-semibold text-md md:text-xl"
                  href="/agendamento"
                >
                  Inscreva-se grátis
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <main className="">
        <BulletIcon
          title="Lugar acolhedor"
          iconPath="/acolhimento.svg"
          text={`No Refúgio Universitário, você encontrará um lugar tranquilo para
        estudar. Nossas instalações oferecem um espaço confortável, com
        ar-condicionado e café, além de uma comunidade incrível.`}
        />
        <BulletIcon
          title="Espaço conectado"
          iconPath="/conect.png"
          text={`Mais que uma boa conexão de internet, queremos ter aqui uma boa
          conexão de pessoas. Um espaço onde você possa se conectar com outras
          pessoas que possuiem o mesmo objetivo que o seu e vão te ajudar no trajeto.`}
        />
        <BulletIcon
          title="Comunidade solidária"
          iconPath="/solidaria.svg"
          text={`Propomos um espaço em que um possa incentivar o outro e ajudar nos
          seus desafios diários. Seja como voluntário do projeto ou como estudante,
          queremos que todos sintam o desejo de contribuir, colaborar e ajudar outros
          a crescerem academicamente.`}
        />
      </main>
    </>
  )
}
