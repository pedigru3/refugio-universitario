'use client'

import { menuList } from '@/consts/menuList'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function MenuDesktop() {
  const pathName = usePathname()

  const { data: session } = useSession()

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
        {session?.user && (
          <li>
            <a
              className={`${
                pathName !== '/profile' && 'opacity-70 hover:opacity-100'
              } transition-all duration-500  `}
              href={'/profile'}
            >
              {'Perfil'}
            </a>
          </li>
        )}
        {session?.user.role === 'admin' && (
          <li>
            <a
              className={`${
                pathName !== '/admin' && 'opacity-70 hover:opacity-100'
              } transition-all duration-500  `}
              href={'/admin'}
            >
              {'Admin'}
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
