'use client'

import { usePathname } from 'next/navigation'

export function MenuDesktop() {
  const pathName = usePathname()
  console.log(pathName)

  const menuList = [
    {
      title: 'Home',
      link: '/',
    },
    {
      title: 'Agendamento',
      link: '/agendamento',
    },
    {
      title: 'FAQ',
      link: '/faq',
    },
  ]

  return (
    <nav>
      <ul className="flex gap-5 text-lg">
        {menuList.map((menu) => {
          return (
            <li key={menu.link}>
              <a
                className={`${
                  pathName !== menu.link && 'opacity-70 hover:opacity-100'
                } transition-all duration-500  `}
                href={menu.link}
              >
                {menu.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
