'use client'

import { Container } from '@/components/container'
import { Header } from '@/components/header'
import { usePathname } from 'next/navigation'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathName = usePathname()

  const hasStepTwo = pathName.includes('/signup/connect-google')
  const hasStepThree = pathName.includes('/signup/connect-google/success')

  return (
    <div className="bg-purple-700 h-screen">
      <Header />
      <div className=" bg-gradient-to-br from-purple-900 via-purple-700 to-purple-400 h-full w-full py-5">
        <Container>
          <h1 className="text-white text-2xl font-medium mb-5">Inscrição</h1>
          <p className="text-sm">
            Passo {hasStepThree ? '3' : hasStepTwo ? '2' : '1'} de 3
          </p>
          <div className="flex gap-1 max-w-[670px]">
            <div className={`w-1/3 h-1 bg-yellow-400`}></div>
            <div
              className={`${
                hasStepTwo ? 'bg-yellow-400' : 'bg-white'
              } w-1/3 h-1 `}
            ></div>
            <div
              className={`w-1/3 h-1 ${
                hasStepThree ? 'bg-yellow-400' : 'bg-white'
              }`}
            ></div>
          </div>
          <div className="max-w-[670px]">{children}</div>
        </Container>
      </div>
    </div>
  )
}
