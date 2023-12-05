import { Container } from '@/components/container'
import { kalam } from '../fonts'
import Image from 'next/image'
import Link from 'next/link'
import { CSSProperties } from 'react'

export default function Sarau() {
  const imageStyle: CSSProperties = {
    objectFit: 'cover',
    objectPosition: 'center',
  }

  return (
    <div className="bg-blue-950 h-full">
      <div className={`bg-blue-950 min-h-screen max-w-[414px] mx-auto`}>
        <div className="bg-purple-dark flex justify-center items-center pt-14 pb-24">
          <Container>
            <h1 className={`${kalam.className} text-[100px] leading-[1]`}>
              Sarau
            </h1>
            <h2 className={`${kalam.className} leading-[0.5] text-lg`}>
              Música - Performance + Poesia
            </h2>
          </Container>
        </div>
        <div className="relative w-full h-[312px] bg-blue-950">
          <Image
            className="-mt-20 absolute z-[1]"
            src={'/paper-mobile.png'}
            alt="paper"
            layout="fill"
            style={imageStyle}
          />
          <div
            className="absolute z-[2] w-full flex 
        flex-col justify-center items-center mt-5 "
          >
            <p
              className={`${kalam.className}  text-[100px] text-black leading-[1]`}
            >
              27/01
            </p>
            <p
              className={`${kalam.className} w-52 text-2xl text-right text-black leading-[1]`}
            >
              às 19h
            </p>
          </div>
          <div className="absolute">
            <div
              className=" bg-[#2E60AB] mt-40 pt-24 z-0 px-10 flex flex-col
          justify-center text-center text-[1.3rem] [&>p]:mt-5"
            >
              <p>
                Tem muito a dizer, mas não tem quem ouça? Traga a sua expressão
                ao sarau.
              </p>
              <p>
                Dia 27 de janeiro estaremos realizando um Sarau para inauguração
                do nosso Refúgio Universitário.
              </p>
              <p>
                Local: Rua Rubéns Ávila, 150. Atrás do restaurante Papo Cabeça.
              </p>
              <p>
                <a href="#" className="underline">
                  Inscreva-se aqui
                </a>
                . Mas atenção, pois as inscrições são limitadas.
              </p>
              <div className="relative flex justify-center w-full -bottom-5">
                <Image
                  className="mt-10 z-[1]"
                  alt="paper"
                  src={'/paper-2.png'}
                  height={45}
                  width={300}
                  style={imageStyle}
                />
                <p
                  className={`absolute top-1/2 right-1/2 text-2xl translate-x-1/2 
                translate-y-1/4 text-black z-[1]
              ${kalam.className}`}
                >
                  Entrada franca
                </p>
              </div>
            </div>
            <div
              className="w-full bg-purple-dark pt-10 text-center 
          text-[1.3rem] [&>p]:mt-5 flex flex-col justify-center items-center
          px-10"
            >
              <Image
                className="pb-5"
                src={'/refugio-logo.png'}
                width={125}
                height={125}
                alt="logo refúgio universitário"
              />
              <h3>O que é o Refúgio Universitário?</h3>
              <p>
                É um espaço compartilhado de estudo. Mais do que isso, é um
                ambiente acolhedor e inspirador projetado para proporcionar aos
                estudantes uma experiência única de aprendizado e colaboração.
              </p>
              <p>
                Estudos comprovam que o ambiente de estudo desempenha um papel
                crucial no desempenho acadêmico. Fatores como organização,
                iluminação adequada e ausência de distrações desempenham um
                papel importante.
              </p>
              <p>
                Aqui, esperamos que você aumente o seu foco e o seu rendimento
                nos estudos, já que as distrações também serão menores do que em
                casa, por exemplo.
              </p>
              <Link
                href={'/signup'}
                className="bg-blue-900 mt-5 px-5 py-2 w-full rounded-xl mb-10"
              >
                Inscreva-se
              </Link>
            </div>
            <div className="flex justify-evenly items-center px-10 bg-white">
              <p className="text-black font-bold text-lg py-10">Apoio:</p>
              <Image
                src={'/catuai-logo.png'}
                width={161}
                height={52}
                alt="Logo Ib Catuai"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
