import Link from 'next/link'
import { Container } from './container'
import Image from 'next/image'
import { MenuDesktop } from './menu-desktop'
import { MenuMobile } from './menu-mobile'

export function Header() {
  return (
    <Container>
      <div className="flex justify-between py-3 md:hidde items-center">
        <Link href={'/'}>
          <Image
            src={'/refugio-logo.png'}
            priority
            width={80}
            height={80}
            alt={'logo Refúgio Universitário'}
          />
        </Link>
        <MenuMobile />
      </div>
      <div className="justify-between py-3 hidden md:flex items-center">
        <Link href={'/'}>
          <Image
            src={'/refugio-logo.png'}
            width={130}
            height={130}
            alt={'logo Refúgio Universitário'}
          />
        </Link>
        <MenuDesktop />
      </div>
    </Container>
  )
}
