'use client'

import { menuList } from '@/consts/menuList'
import { List } from '@phosphor-icons/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export function MenuMobile() {
  const { data: session } = useSession()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <List size={32} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="flex z-50 justify-center items-center flex-col min-w-[200px] shadow-md bg-white rounded-md p-2
        mr-8"
      >
        {menuList.map((menu) => {
          return (
            <Link
              href={menu.link}
              key={menu.link}
              className="flex w-full justify-center items-center border-b last:border-none"
            >
              <DropdownMenu.Item className="text-blue-800 text-center h-10 items-center flex">
                {menu.title}
              </DropdownMenu.Item>
            </Link>
          )
        })}
        {session?.user && (
          <Link
            href={'/profile'}
            className="flex w-full justify-center items-center border-b last:border-none"
          >
            <DropdownMenu.Item className="text-blue-800 text-center h-10 items-center flex">
              {'Perfil'}
            </DropdownMenu.Item>
          </Link>
        )}
        {session?.user.role === 'admin' && (
          <Link
            href={'/admin'}
            className="flex w-full justify-center items-center border-b last:border-none"
          >
            <DropdownMenu.Item className="text-blue-800 text-center h-10 items-center flex">
              {'Admin'}
            </DropdownMenu.Item>
          </Link>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
