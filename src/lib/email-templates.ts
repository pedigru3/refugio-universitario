const BASE_STYLE = {
  body: 'font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;',
  table:
    'max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
  h1: 'color: #333; font-size: 24px;',
  logo:
    'display: block; margin: 0 auto 20px; max-width:100%; margin-bottom: 30px;',
  p: 'color: #555; font-size: 18px; line-height: 1.3;',
  cta: 'display: block; padding: 15px 30px; margin: 20px auto; background-color: #A046F5; color: #fff; text-decoration: none; text-align: center; border-radius: 5px; font-size: 18px;',
  footer: 'color: #aaa; font-size: 13px; text-align: center; margin-top: 32px;',
}

const LOGO_URL =
  'https://www.refugiouniversitario.com.br/_next/image?url=%2Frefugio-universitario.png&w=1200&q=75'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://www.refugiouniversitario.com.br'

function wrap(content: string): string {
  return `
<html>
<head>
  <meta charset="UTF-8" />
  <title>Refúgio Universitário</title>
</head>
<body style="${BASE_STYLE.body}">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="${BASE_STYLE.table}">
    <tr>
      <td>
        <img src="${LOGO_URL}" alt="Refúgio Universitário" style="${BASE_STYLE.logo}" />
        ${content}
        <p style="${BASE_STYLE.footer}">
          Refúgio Universitário · Este e-mail foi enviado automaticamente, por favor não responda.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

// ---------------------------------------------------------------------------
// Template 1 — Boas-vindas (cadastro via admin)
// ---------------------------------------------------------------------------
export function welcomeTemplate(firstName: string): string {
  return wrap(`
    <h1 style="${BASE_STYLE.h1}">Você foi convidado para o Refúgio Universitário!</h1>
    <p style="${BASE_STYLE.p}">Olá ${firstName},</p>
    <p style="${BASE_STYLE.p}">
      Você foi convidado para se juntar à plataforma Refúgio Universitário.
      Por favor, clique no link abaixo para completar seu cadastro e acessar a plataforma.
    </p>
    <p style="width: 100%; margin: auto;">
      <a href="${BASE_URL}/signup" style="${BASE_STYLE.cta}">Completar Cadastro</a>
    </p>
    <p style="${BASE_STYLE.p}">Atenciosamente,<br>Equipe Refúgio</p>
  `)
}

// ---------------------------------------------------------------------------
// Template 2 — Convite para Evento
// ---------------------------------------------------------------------------
export interface EventInviteData {
  title: string
  date: string        // já formatada (ex.: "Sábado, 19/04 às 19h")
  description?: string
  link?: string
}

export function eventInviteTemplate(
  firstName: string,
  event: EventInviteData,
): string {
  const ctaLabel = 'Ver Detalhes do Evento'
  const ctaUrl = event.link ?? BASE_URL

  return wrap(`
    <h1 style="${BASE_STYLE.h1}">🎉 Você está convidado!</h1>
    <p style="${BASE_STYLE.p}">Olá ${firstName},</p>
    <p style="${BASE_STYLE.p}">
      Temos um novo evento especial no <strong>Refúgio Universitário</strong> e gostaríamos
      muito da sua presença:
    </p>

    <!-- Event card -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
      style="background: #f9f5ff; border-left: 4px solid #A046F5; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <tr>
        <td>
          <p style="margin: 0 0 6px; font-size: 20px; font-weight: bold; color: #5b21b6;">
            ${event.title}
          </p>
          <p style="margin: 0 0 4px; font-size: 15px; color: #7c3aed;">
            📅 ${event.date}
          </p>
          ${
            event.description
              ? `<p style="margin: 10px 0 0; font-size: 15px; color: #555;">${event.description}</p>`
              : ''
          }
        </td>
      </tr>
    </table>

    <p style="width: 100%; margin: auto;">
      <a href="${ctaUrl}" style="${BASE_STYLE.cta}">${ctaLabel}</a>
    </p>
    <p style="${BASE_STYLE.p}">
      Esperamos te ver por lá!<br>Equipe Refúgio
    </p>
  `)
}

// ---------------------------------------------------------------------------
// Template 3 — Reengajamento (com campos customizáveis via painel admin)
// ---------------------------------------------------------------------------
export interface ReengagementData {
  subject?: string       // assunto do e-mail (usado na chamada resend.send)
  title?: string         // título grande no topo do e-mail
  body?: string          // parágrafo principal (suporta <br> para quebras de linha)
  ctaLabel?: string      // label do botão
  ctaUrl?: string        // link do botão
}

export const REENGAGEMENT_DEFAULTS: Required<ReengagementData> = {
  subject: '{firstName}, sentimos sua falta no Refúgio!',
  title: 'Estamos com saudades! 👋',
  body: 'O <strong>Refúgio Universitário</strong> é o seu espaço de estudo compartilhado, sempre pronto para te receber. Reserve um horário e venha estudar conosco!',
  ctaLabel: 'Fazer um Agendamento',
  ctaUrl: '{BASE_URL}/agendamento',
}

export function reengagementTemplate(
  firstName: string,
  lastScheduleDate?: string,
  custom?: ReengagementData,
): string {
  const title = custom?.title ?? REENGAGEMENT_DEFAULTS.title
  const body = custom?.body ?? REENGAGEMENT_DEFAULTS.body
  const ctaLabel = custom?.ctaLabel ?? REENGAGEMENT_DEFAULTS.ctaLabel
  const ctaUrl = (custom?.ctaUrl ?? REENGAGEMENT_DEFAULTS.ctaUrl).replace(
    '{BASE_URL}',
    BASE_URL,
  )

  const lastVisitLine = lastScheduleDate
    ? `<p style="${BASE_STYLE.p}">Sua última passagem por aqui foi em <strong>${lastScheduleDate}</strong>. Sentimos sua falta!</p>`
    : ''

  return wrap(`
    <h1 style="${BASE_STYLE.h1}">${title}</h1>
    <p style="${BASE_STYLE.p}">Olá ${firstName},</p>
    ${lastVisitLine}
    <p style="${BASE_STYLE.p}">${body}</p>
    <p style="width: 100%; margin: auto;">
      <a href="${ctaUrl}" style="${BASE_STYLE.cta}">${ctaLabel}</a>
    </p>
    <p style="${BASE_STYLE.p}">Até breve!<br>Equipe Refúgio</p>
  `)
}

export function resolveReengagementSubject(
  firstName: string,
  custom?: ReengagementData,
): string {
  return (custom?.subject ?? REENGAGEMENT_DEFAULTS.subject).replace(
    '{firstName}',
    firstName,
  )
}
