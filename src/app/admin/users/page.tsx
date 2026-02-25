import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/button'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

interface UsersPageProps {
  searchParams: {
    page?: string
    search?: string
    onlyActive?: string
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    redirect('/')
  }

  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const onlyActive = searchParams.onlyActive === 'true'
  const limit = 10
  const skip = (page - 1) * limit

  const baseWhere = {
    name: {
      contains: search,
      mode: 'insensitive' as const,
    },
    ...(onlyActive ? { isActive: true } : {}),
  }

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: baseWhere,
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip,
    }),
    prisma.user.count({
      where: baseWhere,
    }),
  ])

  const totalPages = Math.ceil(totalUsers / limit)

  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">
          Usuários
        </Title>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form className="flex w-full max-w-xl flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <input
                name="search"
                defaultValue={search}
                placeholder="Buscar por nome..."
                className="mt-2 h-11 w-full rounded-full bg-white/90 pl-4 pr-10 text-sm text-black shadow-sm outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                <MagnifyingGlass size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              <input
                id="onlyActive"
                type="checkbox"
                name="onlyActive"
                defaultChecked={onlyActive}
                value="true"
                className="h-4 w-4 accent-purple-600"
              />
              <label htmlFor="onlyActive" className="cursor-pointer">
                Mostrar apenas ativos
              </label>
            </div>
          </form>

          <Link href="/admin/users/create">
            <Button className="!mt-0 p-2 rounded-lg w-full max-w-[200px]">
              Criar novo
            </Button>
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl bg-white/80 shadow-lg">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-zinc-50 text-xs uppercase text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Curso
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Acesso
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isActive = user.isActive ?? false
                const roleLabel = user.role === 'admin' ? 'Admin' : 'Usuário'

                return (
                  <tr
                    key={user.id}
                    className={`border-b last:border-0 ${
                      isActive ? 'bg-white hover:bg-purple-50/40' : 'bg-zinc-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="hover:text-purple-600 hover:underline"
                      >
                        {user.name}
                      </Link>
                      {user.email && (
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                        {user.course || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200'
                        }`}
                      >
                        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                        {roleLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-primary">
            Mostrando <span className="font-semibold">{skip + 1}</span> a{' '}
            <span className="font-semibold">
              {Math.min(skip + limit, totalUsers)}
            </span>{' '}
            de <span className="font-semibold">{totalUsers}</span> resultados
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/users?page=${
                  page - 1
                }&search=${search}&onlyActive=${onlyActive}`}
              >
                <Button bgColor="gray">Anterior</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/users?page=${
                  page + 1
                }&search=${search}&onlyActive=${onlyActive}`}
              >
                <Button bgColor="gray">Próxima</Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
