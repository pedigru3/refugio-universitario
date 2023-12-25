import Image from 'next/image'

type BulletIconProps = {
  title: string
  iconPath: string
  text: string
  alt?: string
}

export function BulletIcon({ iconPath, text, title, alt }: BulletIconProps) {
  return (
    <div className="pt-12">
      <Image
        src={iconPath}
        width={64}
        height={64}
        style={{ objectFit: 'cover' }}
        alt={alt ?? title}
      />
      <h3
        className="text-gray-800 font-bold text-xl font-plus-jakarta-sans
      lg:text-2xl lg:pt-3
      "
      >
        {title}
      </h3>
      <p
        className="text-gray-500 font-normal lg:font-thin lg:text-lg 
      leading-8 lg:leading-8 mt-2"
      >
        {text}
      </p>
    </div>
  )
}
