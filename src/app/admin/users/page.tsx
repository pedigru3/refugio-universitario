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
    }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== 'admin') {
        redirect('/')
    }

    const page = Number(searchParams.page) || 1
    const search = searchParams.search || ''
    const limit = 10
    const skip = (page - 1) * limit

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            take: limit,
            skip,
        }),
        prisma.user.count({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        }),
    ])

    const totalPages = Math.ceil(totalUsers / limit)

    return (
        <div className="mt-10">
            <Container>
                <Title type="h2" color="light">
                    Usuários
                </Title>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <form className="flex w-full max-w-sm items-center gap-2">
                        <div className="relative w-full">
                            <input
                                name="search"
                                defaultValue={search}
                                placeholder="Buscar por nome..."
                                className="pr-10 mt-4 text-black pl-5 w-full h-12 rounded-md outline-0"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                                <MagnifyingGlass size={20} />
                            </button>
                        </div>
                    </form>

                    <Link href="/admin/users/create">
                        <Button>Criar novo</Button>
                    </Link>
                </div>

                <div className="mt-8 overflow-x-auto rounded-lg shadow-md">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Nome
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Curso
                                </th>


                                <th scope="col" className="px-6 py-3">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b bg-white hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="hover:underline hover:text-purple-600"
                                        >
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.course}</td>

                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="font-medium text-purple-600 hover:underline"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
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
                            <Link href={`/admin/users?page=${page - 1}&search=${search}`}>
                                <Button bgColor="gray">Anterior</Button>
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link href={`/admin/users?page=${page + 1}&search=${search}`}>
                                <Button bgColor="gray">Próxima</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}
