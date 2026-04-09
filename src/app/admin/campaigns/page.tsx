'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/container'
import { Title } from '@/components/title'
import dayjs from '@/lib/dayjs'
import { REENGAGEMENT_DEFAULTS } from '@/lib/email-templates'
import {
  EnvelopeSimple,
  CalendarCheck,
  ArrowCounterClockwise,
  UsersThree,
  CheckCircle,
  WarningCircle,
  Spinner,
  Info,
  CheckSquare,
  Square,
  MinusSquare,
} from '@phosphor-icons/react'


// ─── Types ───────────────────────────────────────────────────────────────────

type Filter = 'all' | 'active' | 'inactive' | 'never_scheduled' | 'no_checkin'
type Template = 'event_invite' | 'reengagement'

interface PreviewUser {
  id: string
  name: string
  email: string | null
  course: string
  expires_at: string | null
  Scheduling: { date: string; check_in: string | null }[]
}

interface FilterOption {
  id: Filter
  label: string
  description: string
  icon: React.ReactNode
}

interface TemplateOption {
  id: Template
  label: string
  description: string
  icon: React.ReactNode
  hasForm: boolean
}

interface SendResult {
  sent: number
  skipped: number
  capped?: boolean
  message?: string
  error?: string
}

interface EventOption {
  id: string
  title: string
  description: string | null
  date: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BATCH_LIMIT = 50

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'all',
    label: 'Todos',
    description: 'Todos os usuários com e-mail cadastrado',
    icon: <UsersThree size={20} weight="duotone" />,
  },
  {
    id: 'active',
    label: 'Ativos',
    description: 'Cadastro ainda dentro da validade',
    icon: <CheckCircle size={20} weight="duotone" />,
  },
  {
    id: 'inactive',
    label: 'Inativos',
    description: 'Cadastro com validade vencida',
    icon: <WarningCircle size={20} weight="duotone" />,
  },
  {
    id: 'never_scheduled',
    label: 'Nunca agendaram',
    description: 'Nunca fizeram um agendamento',
    icon: <CalendarCheck size={20} weight="duotone" />,
  },
  {
    id: 'no_checkin',
    label: 'Sem check-in',
    description: 'Têm agendamento, mas nunca fizeram check-in',
    icon: <ArrowCounterClockwise size={20} weight="duotone" />,
  },
]

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'event_invite',
    label: 'Convite para Evento',
    description: 'Convide os usuários para um evento específico no Refúgio.',
    icon: <CalendarCheck size={28} weight="duotone" />,
    hasForm: true,
  },
  {
    id: 'reengagement',
    label: 'Reengajamento',
    description: 'Relembre os usuários da plataforma e convide-os a agendar.',
    icon: <ArrowCounterClockwise size={28} weight="duotone" />,
    hasForm: false,
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Preview / user list
  const [previewUsers, setPreviewUsers] = useState<PreviewUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Individual selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Event form state
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventLink, setEventLink] = useState('')

  // Fetch events list once on mount
  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => {})
  }, [])

  // Auto-fill fields when an event is selected
  function handleSelectEvent(id: string) {
    setSelectedEventId(id)
    const ev = events.find((e) => e.id === id)
    if (!ev) return
    setEventTitle(ev.title)
    setEventDate(dayjs.utc(ev.date).format('dddd, DD/MM [às] HH[h]'))
    setEventDescription(ev.description ?? '')
    setEventLink(`${window.location.origin}/evento/${ev.id}`)
  }

  // Reengagement customization state (pre-filled with defaults)
  const [reengSubject, setReengSubject] = useState(REENGAGEMENT_DEFAULTS.subject)
  const [reengTitle, setReengTitle] = useState(REENGAGEMENT_DEFAULTS.title)
  const [reengBody, setReengBody] = useState(REENGAGEMENT_DEFAULTS.body)
  const [reengCtaLabel, setReengCtaLabel] = useState(REENGAGEMENT_DEFAULTS.ctaLabel)
  const [reengCtaUrl, setReengCtaUrl] = useState(REENGAGEMENT_DEFAULTS.ctaUrl)

  // Send
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // ── Fetch users for the current filter ──────────────────────────────────
  const fetchUsers = useCallback(async (filter: Filter) => {
    setLoadingUsers(true)
    setPreviewUsers([])
    setSelectedIds(new Set())
    setResult(null)
    try {
      const res = await fetch(`/api/v1/admin/campaigns/preview?filter=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setPreviewUsers(data.users ?? [])
        // Start with all users selected
        setSelectedIds(new Set((data.users ?? []).map((u: PreviewUser) => u.id)))
      }
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(selectedFilter)
  }, [selectedFilter, fetchUsers])

  // ── Selection helpers ────────────────────────────────────────────────────
  function toggleUser(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setResult(null)
  }

  function toggleAll() {
    if (selectedIds.size === previewUsers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(previewUsers.map((u) => u.id)))
    }
    setResult(null)
  }

  const allSelected = previewUsers.length > 0 && selectedIds.size === previewUsers.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < previewUsers.length
  const cappedCount = Math.min(selectedIds.size, BATCH_LIMIT)

  // ── Send ─────────────────────────────────────────────────────────────────
  async function handleSend() {
    if (!selectedTemplate || selectedIds.size === 0) return
    setShowConfirm(false)
    setSending(true)
    setResult(null)

    const payload: Record<string, unknown> = {
      user_ids: Array.from(selectedIds),
      template: selectedTemplate,
    }

    if (selectedTemplate === 'event_invite') {
      payload.event = {
        title: eventTitle,
        date: eventDate,
        description: eventDescription || undefined,
        link: eventLink || undefined,
      }
    }

    if (selectedTemplate === 'reengagement') {
      payload.reengagement = {
        subject: reengSubject || undefined,
        title: reengTitle || undefined,
        body: reengBody || undefined,
        ctaLabel: reengCtaLabel || undefined,
        ctaUrl: reengCtaUrl || undefined,
      }
    }

    try {
      const res = await fetch('/api/v1/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data: SendResult = await res.json()
      setResult(data)
    } catch {
      setResult({ sent: 0, skipped: 0, error: 'Erro de rede. Tente novamente.' })
    } finally {
      setSending(false)
    }
  }

  const canSend =
    selectedTemplate !== null &&
    selectedIds.size > 0 &&
    !sending &&
    (selectedTemplate !== 'event_invite' || eventTitle.trim().length > 0)

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mt-10 pb-16">
      <Container>
        <Title type="h2" color="light">
          Campanhas de E-mail
        </Title>
        <p className="mt-1 text-sm text-purple-200">
          Filtre o público, selecione os destinatários, escolha o template e dispare.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* ── Left column ─────────────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Step 1 — Filter */}
            <section className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
              <h2 className="mb-1 text-base font-semibold text-white">
                1. Escolha o grupo
              </h2>
              <p className="mb-4 text-xs text-purple-200">
                Apenas usuários com e-mail cadastrado são exibidos.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedFilter(opt.id)
                      setResult(null)
                    }}
                    className={`flex items-start gap-3 rounded-xl p-4 text-left ring-1 transition-all ${
                      selectedFilter === opt.id
                        ? 'bg-purple-600 ring-purple-400 text-white'
                        : 'bg-white/5 ring-white/10 text-purple-100 hover:bg-white/10'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="mt-0.5 text-xs opacity-75">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2 — User Selection Table */}
            <section className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    2. Selecione os destinatários
                  </h2>
                  <p className="mt-0.5 text-xs text-purple-200">
                    {loadingUsers
                      ? 'Carregando...'
                      : `${selectedIds.size} de ${previewUsers.length} selecionado(s)`}
                  </p>
                </div>

                {/* Select all toggle */}
                {previewUsers.length > 0 && (
                  <button
                    onClick={toggleAll}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-white/20 transition ring-1 ring-white/10"
                  >
                    {allSelected ? (
                      <CheckSquare size={15} weight="fill" className="text-purple-300" />
                    ) : someSelected ? (
                      <MinusSquare size={15} weight="fill" className="text-purple-300" />
                    ) : (
                      <Square size={15} className="text-purple-300" />
                    )}
                    {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
                  </button>
                )}
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size={28} className="animate-spin text-purple-300" />
                </div>
              ) : previewUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-purple-300">
                  Nenhum usuário encontrado para este filtro.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase text-purple-300">
                      <tr>
                        <th className="w-10 px-4 py-3" />
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Curso</th>
                        <th className="px-4 py-3 hidden md:table-cell">Último Agendamento</th>
                        <th className="px-4 py-3 hidden md:table-cell">Check-in</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewUsers.map((user, idx) => {
                        const isChecked = selectedIds.has(user.id)
                        const lastSched = user.Scheduling[0]
                        const lastSchedDate = lastSched
                          ? dayjs(lastSched.date).format('DD/MM/YY')
                          : '—'
                        const lastCheckin = lastSched?.check_in
                          ? dayjs(lastSched.check_in).format('DD/MM/YY')
                          : '—'

                        return (
                          <tr
                            key={user.id}
                            onClick={() => toggleUser(user.id)}
                            className={`cursor-pointer border-t border-white/5 transition-colors ${
                              isChecked
                                ? 'bg-purple-600/20 hover:bg-purple-600/30'
                                : idx % 2 === 0
                                ? 'bg-white/3 hover:bg-white/8'
                                : 'bg-transparent hover:bg-white/5'
                            }`}
                          >
                            <td className="px-4 py-3">
                              {isChecked ? (
                                <CheckSquare
                                  size={18}
                                  weight="fill"
                                  className="text-purple-400"
                                />
                              ) : (
                                <Square size={18} className="text-purple-500/50" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-xs text-purple-300">{user.email}</p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell text-purple-200 text-xs">
                              {user.course || '—'}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-purple-200 text-xs">
                              {lastSchedDate}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs">
                              <span
                                className={`rounded-full px-2 py-0.5 font-medium ${
                                  lastSched?.check_in
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-zinc-500/20 text-zinc-400'
                                }`}
                              >
                                {lastCheckin}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Step 3 — Template */}
            <section className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
              <h2 className="mb-1 text-base font-semibold text-white">
                3. Escolha o template
              </h2>
              <p className="mb-4 text-xs text-purple-200">
                O conteúdo do e-mail que será enviado aos destinatários selecionados.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TEMPLATE_OPTIONS.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplate(tpl.id)
                      setResult(null)
                    }}
                    className={`flex flex-col gap-3 rounded-xl p-5 text-left ring-1 transition-all ${
                      selectedTemplate === tpl.id
                        ? 'bg-purple-600 ring-purple-400 text-white'
                        : 'bg-white/5 ring-white/10 text-purple-100 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-fit rounded-lg p-2 ${
                        selectedTemplate === tpl.id
                          ? 'bg-white/20'
                          : 'bg-purple-700/40'
                      }`}
                    >
                      {tpl.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{tpl.label}</p>
                      <p className="mt-1 text-xs opacity-75">{tpl.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Event form */}
              {selectedTemplate === 'event_invite' && (
                <div className="mt-6 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs font-medium text-purple-200">
                      <Info size={14} />
                      Preencha as informações do evento
                    </p>
                  </div>
                  <div className="grid gap-4">

                    {/* Event selector */}
                    {events.length > 0 && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-purple-100">
                          Selecionar evento cadastrado
                          <span className="ml-1 text-purple-400 font-normal">(pré-preenche os campos abaixo)</span>
                        </label>
                        <select
                          value={selectedEventId}
                          onChange={(e) => handleSelectEvent(e.target.value)}
                          className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="">— Escolher evento —</option>
                          {events.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                              {ev.title} · {dayjs(ev.date).format('DD/MM/YYYY')}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Divider */}
                    {events.length > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-purple-400">ou edite manualmente</span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Título do evento <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="Ex: Pizza Night · Edição Junho"
                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Data e horário <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        placeholder="Ex: Sábado, 19/04 às 19h"
                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Descrição{' '}
                        <span className="text-purple-400">(opcional)</span>
                      </label>
                      <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        rows={3}
                        placeholder="Uma breve descrição do evento..."
                        className="w-full resize-none rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Link do evento{' '}
                        <span className="text-purple-400">(opcional)</span>
                      </label>
                      <input
                        value={eventLink}
                        onChange={(e) => setEventLink(e.target.value)}
                        placeholder="https://refugiouniversitario.com.br/evento/..."
                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reengagement customization form */}
              {selectedTemplate === 'reengagement' && (
                <div className="mt-6 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs font-medium text-purple-200">
                      <Info size={14} />
                      Personalize o conteúdo do e-mail
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setReengSubject(REENGAGEMENT_DEFAULTS.subject)
                        setReengTitle(REENGAGEMENT_DEFAULTS.title)
                        setReengBody(REENGAGEMENT_DEFAULTS.body)
                        setReengCtaLabel(REENGAGEMENT_DEFAULTS.ctaLabel)
                        setReengCtaUrl(REENGAGEMENT_DEFAULTS.ctaUrl)
                      }}
                      className="text-xs text-purple-400 hover:text-purple-200 underline transition"
                    >
                      Restaurar padrão
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Assunto do e-mail
                        <span className="ml-1 text-purple-400 font-normal">
                          (use <code className="bg-white/10 px-1 rounded">{'{firstName}'}</code> para o nome)
                        </span>
                      </label>
                      <input
                        value={reengSubject}
                        onChange={(e) => setReengSubject(e.target.value)}
                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Título do e-mail
                      </label>
                      <input
                        value={reengTitle}
                        onChange={(e) => setReengTitle(e.target.value)}
                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-purple-100">
                        Mensagem principal
                        <span className="ml-1 text-purple-400 font-normal">
                          (HTML permitido, ex: <code className="bg-white/10 px-1 rounded">&lt;strong&gt;</code>)
                        </span>
                      </label>
                      <textarea
                        value={reengBody}
                        onChange={(e) => setReengBody(e.target.value)}
                        rows={4}
                        className="w-full resize-y rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-purple-100">
                          Label do botão
                        </label>
                        <input
                          value={reengCtaLabel}
                          onChange={(e) => setReengCtaLabel(e.target.value)}
                          className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-purple-100">
                          URL do botão
                        </label>
                        <input
                          value={reengCtaUrl}
                          onChange={(e) => setReengCtaUrl(e.target.value)}
                          className="w-full rounded-lg bg-white/90 px-4 py-2.5 text-sm text-gray-800 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ── Right column — sticky summary ────────────────────── */}
          <div>
            <div className="sticky top-6 flex flex-col gap-4">
              <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Resumo do disparo
                </p>

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-purple-100">Grupo</span>
                  <span className="rounded-full bg-purple-700/60 px-3 py-0.5 text-xs font-medium text-white">
                    {FILTER_OPTIONS.find((f) => f.id === selectedFilter)?.label}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-purple-100">Template</span>
                  <span className="rounded-full bg-purple-700/60 px-3 py-0.5 text-xs font-medium text-white">
                    {selectedTemplate
                      ? TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.label
                      : '—'}
                  </span>
                </div>

                {/* Count */}
                <div className="mb-5 rounded-xl bg-white/5 p-4 text-center ring-1 ring-white/10">
                  {loadingUsers ? (
                    <Spinner size={28} className="mx-auto animate-spin text-purple-300" />
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-white">
                        {cappedCount}
                      </p>
                      <p className="mt-1 text-xs text-purple-300">
                        destinatário(s) selecionado(s)
                      </p>
                      {selectedIds.size > BATCH_LIMIT && (
                        <p className="mt-2 text-xs text-amber-300">
                          Apenas os primeiros {BATCH_LIMIT} serão enviados
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Batch limit notice */}
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 ring-1 ring-amber-400/20">
                  <Info size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  <p className="text-xs text-amber-300">
                    Limite de <strong>50 e-mails por campanha</strong> (plano gratuito Resend).
                  </p>
                </div>

                <button
                  id="btn-send-campaign"
                  disabled={!canSend}
                  onClick={() => setShowConfirm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? (
                    <>
                      <Spinner size={16} className="animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <EnvelopeSimple size={16} weight="bold" />
                      Disparar E-mails
                    </>
                  )}
                </button>
              </div>

              {/* Result */}
              {result && (
                <div
                  className={`rounded-2xl p-5 ring-1 ${
                    result.error
                      ? 'bg-red-500/10 ring-red-400/30'
                      : 'bg-emerald-500/10 ring-emerald-400/30'
                  }`}
                >
                  {result.error ? (
                    <div className="flex items-start gap-3">
                      <WarningCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
                      <div>
                        <p className="text-sm font-semibold text-red-300">Erro</p>
                        <p className="mt-1 text-xs text-red-200">{result.error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-emerald-400"
                        weight="fill"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">
                          Campanha enviada!
                        </p>
                        <p className="mt-1 text-xs text-emerald-200">
                          <strong>{result.sent}</strong> e-mail(s) enviado(s)
                          {result.skipped > 0 && (
                            <span className="text-purple-300">
                              {' · '}
                              {result.skipped} sem e-mail (ignorado
                              {result.skipped > 1 ? 's' : ''})
                            </span>
                          )}
                        </p>
                        {result.capped && (
                          <p className="mt-1.5 text-xs text-amber-300">
                            ⚠️ Lista limitada a {BATCH_LIMIT} destinatários.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* ── Confirm Modal ─────────────────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-purple-900 p-6 ring-1 ring-white/10 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-white">
              Confirmar disparo
            </h3>
            <p className="mb-1 text-sm text-purple-200">
              Você está prestes a enviar e-mails para{' '}
              <strong className="text-white">{cappedCount}</strong> destinatário
              {cappedCount !== 1 ? 's' : ''}.
            </p>
            {selectedTemplate && (
              <p className="mb-4 text-xs text-purple-400">
                Template:{' '}
                <span className="font-medium text-purple-200">
                  {TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.label}
                </span>
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-purple-300 ring-1 ring-white/10 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-send"
                onClick={handleSend}
                className="flex-1 rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white hover:bg-purple-400 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
