import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import dayjsUtc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

dayjs.extend(dayjsUtc)
dayjs.extend(timezone)

type RouteParams = {
  params: Promise<{ username: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { username } = await params

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  const appointments = await prisma.scheduling.findMany({
    where: {
      user_id: userExists.id,
      date: {
        gte: new Date().toISOString(),
      },
    },
    select: {
      id: true,
      date: true,
    },
    orderBy: {
      date: 'asc',
    },
  })

  return Response.json({
    appointments,
  })
}

export async function POST(request: Request, { params }: RouteParams) {
  const { username } = await params

  const [session, userExists] = await Promise.all([
    getServerSession(authOptions),
    prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        Scheduling: true,
      },
    }),
  ])

  if (!userExists) {
    return Response.json({ error: 'user not find' }, { status: 400 })
  }

  if (session?.user.role !== 'admin' && userExists.id !== session?.user.id) {
    return Response.json({ error: 'unauthorized user' }, { status: 401 })
  }

  const BorySchema = z.object({
    date: z.string(),
    table_id: z.string().uuid().optional(),
    spent_time_in_minutes: z.number().optional(),
  })

  try {
    const bory = await request.json()
    const {
      date,
      spent_time_in_minutes,
    } = BorySchema.parse(bory)

    const schedulingDate = dayjs(date)

    const alreadyScheduledTime =
      userExists.Scheduling.filter((scheduling: { date: Date }) => {
        return scheduling.date.toISOString() === new Date(date).toISOString()
      }).length >= 1

    if (alreadyScheduledTime) {
      return Response.json(
        {
          error: 'This time has already been set by the user',
          message: 'Você já tem uma reserva nesse horário',
        },
        { status: 409 },
      )
    }

    await Promise.all([
      prisma.scheduling.create({
        data: {
          date,
          user_id: userExists.id,
          table_id: null as any,
          spent_time_in_minutes: spent_time_in_minutes || 60,
        },
      }),
      prisma.user.update({
        where: { id: userExists.id },
        data: {
          expires_at: dayjs().add(30, 'days').toISOString(),
        },
      }),
    ])

    const calendar = google.calendar({
      version: 'v3',
      auth: await getGoogleOAuthToken(userExists.id),
    })

    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: 'Estudar: Refúgio Universitário',
        description: `Reserva de estudo.`,
        start: {
          dateTime: schedulingDate.format(),
        },
        end: {
          dateTime: schedulingDate.add(spent_time_in_minutes || 60, 'minute').format(),
        },
        attendees: [{ email: userExists.email, displayName: userExists.name }],
      },
    })

    // Enviar e-mail de notificação para o administrador (apenas se for usuário comum)
    if (session?.user.role !== 'admin') {
      try {
        await resend.emails.send({
          from: 'Refúgio <notificacao@refugiouniversitario.com.br>',
          to: ['ferreira.contato1@gmail.com'],
          subject: `Novo Agendamento: ${userExists.name}`,
          html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #A046F5;">Novo Agendamento Realizado!</h2>
              <p>Um novo agendamento foi feito na plataforma:</p>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Estudante:</strong> ${userExists.name}</li>
                <li><strong>E-mail:</strong> ${userExists.email}</li>
                <li><strong>Data/Hora:</strong> ${dayjs.utc(date).tz('America/Sao_Paulo').format('DD/MM/YYYY [das] HH:mm')} às ${dayjs.utc(date).add(spent_time_in_minutes || 60, 'minute').tz('America/Sao_Paulo').format('HH:mm')}</li>
              </ul>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">Este é um e-mail automático do sistema Refúgio Universitário.</p>
            </body>
          </html>
          `,
        })
      } catch (emailError) {
        console.error('Erro ao enviar e-mail de notificação:', emailError)
        // Não falha a requisição se apenas o e-mail falhar
      }
    }

    return Response.json({}, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: `Something unexpected happened` },
      { status: 500 },
    )
  }
}
