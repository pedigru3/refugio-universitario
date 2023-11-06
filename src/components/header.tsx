import Link from 'next/link'
import { Container } from './container'
import Image from 'next/image'

export function Header() {
  return (
    <Container>
      <div className="flex justify-between py-3 md:hidden">
        <Link href={'/'}>
          <Image
            src={'/refugio-logo.png'}
            priority
            width={80}
            height={80}
            alt={'logo Refúgio Universitário'}
          />
        </Link>
        <p>menu</p>
      </div>
      <div className="justify-between py-3 hidden md:flex">
        <Image
          src={'/refugio-logo.png'}
          width={130}
          height={10}
          alt={'logo Refúgio Universitário'}
        />
        <p>menu</p>
      </div>
    </Container>
  )
}
