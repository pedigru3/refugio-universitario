import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import { welcomeTemplate } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const adminCreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email().toLowerCase(),
  course: z.string(),
  education_level: z.string(),
  role: z.string(),
  cellphone: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
})

const signupPreRegisterSchema = z.object({
  name: z.string(),
  username: z.string(),
  course: z.string(),
  education_level: z.string(),
})

export async function POST(req: Request) {
  console.log('API route hit')
  try {
    const body = await req.json()
    console.log('Request body:', body)

    // Fluxo 1: pré-cadastro do signup (sem e-mail ainda)
    if ('username' in body && !('email' in body)) {
      const { name, username, course, education_level } =
        signupPreRegisterSchema.parse(body)

      const user = await prisma.user.create({
        data: {
          name,
          username,
          course,
          education_level,
        },
      })

      // guarda o id em cookie para o PrismaAdapter completar depois
      ;(await cookies()).set('@refugiouniversitario:userId', user.id, {
        path: '/',
        httpOnly: true,
      })

      return NextResponse.json({ id: user.id }, { status: 201 })
    }

    // Fluxo 2: criação via admin (com e-mail e role)
    const {
      name,
      email,
      course,
      education_level: educationLevel,
      role,
      cellphone,
      birthday,
      expires_at: expiresAt,
    } = adminCreateUserSchema.parse(body)

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      console.log('User already exists')
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 },
      )
    }

    const username = `${email.split('@')[0].replace('.', '_')}_${Math.random()
      .toString(36)
      .substring(2, 7)}`

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        course,
        education_level: educationLevel,
        role,
        cellphone: cellphone?.trim() || null,
        birthday: birthday ? new Date(birthday) : null,
        expires_at: expiresAt ? new Date(expiresAt) : dayjs().add(30, 'days').toDate(),
      },
    })

    console.log('User created:', user)

    const firstName = name.split(' ', 1)[0]

    await resend.emails.send({
      from: 'Refúgio <contato@refugiouniversitario.com.br>',
      to: [email],
      subject: `Você foi convidado para o Refúgio Universitário!`,
      html: welcomeTemplate(firstName),
    })

    console.log('Email sent')
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request body', issues: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}
