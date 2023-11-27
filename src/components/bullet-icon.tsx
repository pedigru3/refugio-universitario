import Image from 'next/image'
import { Container } from './container'

type BulletIconProps = {
  title: string
  iconPath: string
  text: string
  alt?: string
}

export function BulletIcon({ iconPath, text, title, alt }: BulletIconProps) {
  return (
    <Container>
      <div className="mt-12">
        <Image src={iconPath} width={64} height={64} alt={alt ?? title} />
        <h3 className="text-gray-800 font-bold text-xl font-plus-jakarta-sans">
          {title}
        </h3>
        <p className="text-gray-500 font-normal leading-7 mt-2">{text}</p>
      </div>
    </Container>
  )
}
