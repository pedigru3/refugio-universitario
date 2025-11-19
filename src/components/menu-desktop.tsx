'use client'

import { menuList } from '@/consts/menuList'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
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
              <Link
                className={`${
                  pathName !== menu.link && 'opacity-70 hover:opacity-100'
                } transition-all duration-500  `}
                href={menu.link}
              >
                {menu.title}
              </Link>
            </li>
          )
        })}
        {session?.user && (
          <li>
            <Link
              className={`${
                pathName !== '/profile' && 'opacity-70 hover:opacity-100'
              } transition-all duration-500  `}
              href={'/profile'}
            >
              {'Perfil'}
            </Link>
          </li>
        )}
        {session?.user.role === 'admin' && (
          <li>
            <Link
              prefetch
              className={`${
                pathName !== '/admin' && 'opacity-70 hover:opacity-100'
              } transition-all duration-500  `}
              href={'/admin'}
            >
              {'Admin'}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
