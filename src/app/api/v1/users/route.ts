import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email().toLowerCase(),
  course: z.string(),
  education_level: z.string(),
  role: z.string(),
})

export async function POST(req: Request) {
  console.log('API route hit')
  try {
    const body = await req.json()
    console.log('Request body:', body)

    const { name, email, course, education_level, role } =
      createUserSchema.parse(body)

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

    console.log('Creating user with data:', {
      name,
      email,
      username,
      course,
      education_level,
      role,
    })

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        course,
        education_level,
        role,
      },
    })

    console.log('User created:', user)

    const firstName = name.split(' ', 1)[0]

    await resend.emails.send({
      from: 'Refúgio <contato@refugiouniversitario.com.br>',
      to: [email],
      subject: `Você foi convidado para o Refúgio Universitário!`,
      html: `
      <html>
        <head>
          <title>Bem-Vindo ao Refúgio Universitário</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <tr>
              <td>
                <h1 style="color: #333; font-size: 24px;">Você foi convidado para o Refúgio Universitário!</h1>
                <img src="https://www.refugiouniversitario.com.br/_next/image?url=%2Frefugio-universitario.png&w=1200&q=75" alt="Refúgio Universitário" style="display: block; margin: 0 auto 20px; max-width:100%; margin-bottom: 30px;">
                <p style="color: #555; font-size: 18px; line-height: 1.3">Olá ${firstName},</p>
                <p style="color: #555; font-size: 18px; line-height: 1.3;">Você foi convidado para se juntar à plataforma Refúgio Universitário. Por favor, clique no link abaixo para completar seu cadastro e acessar a plataforma.</p>
                <p style="width: 100%; margin: auto;"><a href="${process.env.NEXTAUTH_URL}/signup" style="display: block; padding: 15px 30px; margin: 20px auto; background-color: #A046F5; color: #fff; text-decoration: none; text-align: center; border-radius: 5px; font-size: 18px;">Completar Cadastro</a></p>
                <p style="color: #555; font-size: 18px; line-height: 1.3">Atenciosamente,<br>Equipe Refúgio</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
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