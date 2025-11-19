import Image from 'next/image'
import Link from 'next/link'

export function MenuAdmin() {
  return (
    <ul className="flex flex-col gap-5 mt-10 mx-5">
      <li>
        <Link href={'/'}>
          <Image
            src={'/refugio-logo.png'}
            width={100}
            height={100}
            alt="Refúgio Universitário"
          />
        </Link>
      </li>
      <li>
        <Link href={'/admin'}>Horários</Link>
      </li>
      <li>
        <Link href={'/admin/schedules'}>Agendamentos</Link>
      </li>
      <li>
        <Link href={'/admin/tables'}>Gerenciar Mesas</Link>
      </li>
      <li>
        <Link href={'/admin/blocked-days'}>Datas Bloqueadas</Link>
      </li>
    </ul>
  )
}
