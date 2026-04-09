import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import {
  eventInviteTemplate,
  reengagementTemplate,
  resolveReengagementSubject,
  type ReengagementData,
} from '@/lib/email-templates'
import dayjs from '@/lib/dayjs'

const resend = new Resend(process.env.RESEND_API_KEY)

// Resend free plan: 100 emails/day total
// We cap each campaign batch to 50 to leave headroom for transactional emails
const BATCH_SIZE = 50

const campaignBodySchema = z.object({
  // Explicitly selected user IDs (from the UI selection table)
  user_ids: z.array(z.string()).min(1),
  template: z.enum(['event_invite', 'reengagement']),
  event: z
    .object({
      title: z.string().min(1),
      date: z.string().min(1),
      description: z.string().optional(),
      link: z.string().url().optional(),
    })
    .optional(),
  reengagement: z
    .object({
      subject: z.string().optional(),
      title: z.string().optional(),
      body: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaUrl: z.string().optional(),
    })
    .optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: z.infer<typeof campaignBodySchema>

  try {
    body = campaignBodySchema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: err.issues },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { user_ids, template, event, reengagement } = body

  if (template === 'event_invite' && !event) {
    return NextResponse.json(
      { error: 'event data is required for event_invite template' },
      { status: 400 },
    )
  }

  // ── Fetch the selected users (enforce BATCH_SIZE hard cap) ──────────────
  const ids = user_ids.slice(0, BATCH_SIZE)

  const users = await prisma.user.findMany({
    where: {
      id: { in: ids },
      email: { not: null },
    },
    select: {
      id: true,
      name: true,
      email: true,
      Scheduling: {
        orderBy: { date: 'desc' },
        take: 1,
        select: { date: true },
      },
    },
  })

  const skipped = ids.length - users.length // users without email (already filtered by where clause)
  const capped = user_ids.length > BATCH_SIZE

  if (users.length === 0) {
    return NextResponse.json({
      sent: 0,
      skipped,
      capped,
      message: 'Nenhum destinatário com e-mail válido encontrado.',
    })
  }

  // ── Build email payloads ────────────────────────────────────────────────
  const from = 'Refúgio <contato@refugiouniversitario.com.br>'

  const messages = users.map((user) => {
    const firstName = user.name.split(' ')[0]
    const lastSchedule = user.Scheduling[0]
    const lastScheduleFormatted = lastSchedule
      ? dayjs.utc(lastSchedule.date).format('DD/MM/YYYY')
      : undefined

    let subject: string
    let html: string

    if (template === 'event_invite' && event) {
      subject = `🎉 Convite: ${event.title}`
      html = eventInviteTemplate(firstName, event)
    } else {
      const customReeng = reengagement as ReengagementData | undefined
      subject = resolveReengagementSubject(firstName, customReeng)
      html = reengagementTemplate(firstName, lastScheduleFormatted, customReeng)
    }

    return {
      from,
      to: [user.email as string],
      subject,
      html,
    }
  })

  // ── Send batch ──────────────────────────────────────────────────────────
  try {
    await resend.batch.send(messages)

    return NextResponse.json({
      sent: messages.length,
      skipped,
      capped,
      message: `${messages.length} e-mail(s) enviado(s) com sucesso.`,
    })
  } catch (err) {
    console.error('[campaigns] Resend batch error:', err)
    return NextResponse.json(
      { error: 'Falha ao enviar e-mails. Verifique os logs do servidor.' },
      { status: 500 },
    )
  }
}
