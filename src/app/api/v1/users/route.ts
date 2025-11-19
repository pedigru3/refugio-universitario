import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      username: true,
    },
  })

  return Response.json({ users }, { status: 200 })
}

export async function POST(req: Request) {
  const { name, username, course, educationLevel } = await req.json()

  function setCookie(userId: string) {
    cookies().set('@refugiouniversitario:userId', userId, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (userAlreadyExists) {
      if (userAlreadyExists.email) {
        return Response.json({ error: 'Usuário já existe' }, { status: 400 })
      }
      // if have no email
      await prisma.user.update({
        where: { id: userAlreadyExists.id },
        data: {
          name,
          course,
          education_level: educationLevel,
        },
      })

      setCookie(userAlreadyExists.id)

      return Response.json({}, { status: 201 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        username: username.toLowerCase(),
        course,
        education_level: educationLevel,
      },
    })

    setCookie(user.id)

    return Response.json({}, { status: 201 })
  } catch (error) {
    return Response.json({ error: `${error}` }, { status: 400 })
  }
}
