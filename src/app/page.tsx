import Image from 'next/image'
import { Container } from '@/components/container'
import { Header } from '@/components/header'
import Link from 'next/link'
import { BulletIcon } from '@/components/bullet-icon'
import { Title } from '@/components/title'

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end min-h-[650px] w-full">
        <Header />
        <Container>
          <div className="flex flex-col justify-center md:flex-row lg:h-96 lg:mt-10">
            <figure className="flex w-full lg:w-1/2 justify-center self-center p-5 md:order-2">
              <Image
                className="wp-full"
                src={'/refugio-universitario.png'}
                width={600}
                height={300}
                alt="Ilustração de estudantes no Refúgio Universitário"
              />
            </figure>
            <div className="lg:w-1/2">
              <h1
                className={`font-plus-jakarta-sans font-semibold text-3xl leading-[1.2] md:text-[3rem] lg:text-[4rem] py-3
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
                  href="/schedules"
                >
                  Inscreva-se grátis
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <main className="bg-white">
        <Container>
          <div className="md:grid md:grid-cols-3 gap-10">
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
          pessoas que possuem o mesmo objetivo que o seu e vão te ajudar no trajeto.`}
            />
            <BulletIcon
              title="Comunidade solidária"
              iconPath="/solidaria.svg"
              text={`Propomos um espaço em que um possa incentivar o outro e ajudar nos
          seus desafios diários. Seja como voluntário do projeto ou como estudante,
          queremos que todos sintam o desejo de contribuir, colaborar e ajudar outros
          a crescerem academicamente.`}
            />
          </div>
        </Container>
        <Container>
          <div className="pt-10 text-gray-500 leading-8 mb-10">
            <div className="max-w-[16rem] md:max-w-none">
              <Title color="dark" type="h2">
                Conheça nosso espaço de estudo
              </Title>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-10">
              <Image
                className="pt-5 object-cover hidden lg:flex w-2/3"
                src={'/espaco-concentracao-1.jpg'}
                width={800}
                height={800}
                alt="Espaço Concentração - Refúgio universitário"
              ></Image>
              <Image
                className="pt-5 object-cover lg:hidden"
                src={'/espaco-concentracao-1.jpg'}
                width={450}
                height={450}
                alt="Espaço Concentração - Refúgio universitário"
              ></Image>
              <div>
                <p className="pt-5">
                  Estamos localizados perto da UEL (Universidade Estadual de
                  Londrina), dentro do Condomínio Universitário. Utilizamos o
                  espaço cedido pela Igreja Batista Catuaí (R. Rubéns Ávila,
                  150). Contamos com:
                </p>
                <p className="pt-2">
                  <span className="font-bold">Espaço Café:</span> Temos um local
                  para você tomar café, bater um papo e interagir com outros
                  estudantes.
                </p>

                <p className="pt-2">
                  <span className="font-bold">Espaço Concentração:</span> Temos
                  um espaço especialmente para manter o seu foco nos estudos,
                  equipado com mesas e sofás para garantir seu conforto enquanto
                  se concentra nas tarefas acadêmicas.
                </p>
              </div>
            </div>
          </div>
        </Container>
        <div className="bg-gray-800">
          <Container>
            <div className="flex justify-center items-center flex-col pb-10">
              <Image
                className="pt-10"
                src={'/refugio-logo.png'}
                width={130}
                height={130}
                alt="Refúgio Logo"
              />
              <p className="text-center text-xl">
                {`"Queremos ser um lugar de acolhimento e uma possibilidade de família"`}
              </p>
            </div>
          </Container>
        </div>
      </main>
      <footer className="bg-white text-black justify-center text-center p-5 text-sm">
        Confira nossa{' '}
        <Link className="underline" href={'/privacy-policy'}>
          Política de Privacidade
        </Link>{' '}
        e{' '}
        <Link className="underline" href={'/privacy-policy/term'}>
          Termos de Uso
        </Link>
      </footer>
    </>
  )
}
