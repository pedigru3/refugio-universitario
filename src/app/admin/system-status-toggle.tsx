'use client'

import { useEffect, useState } from 'react'
import {
  ArrowClockwise,
  CircleNotch,
  LockSimple,
  LockSimpleOpen,
  User,
} from '@phosphor-icons/react'
import { FormAnnotation } from '@/components/form-annotation'

const CAPACITY_LEVELS = [1, 2, 3, 4, 5] as const

const STATUS_CONFIG = {
  open: {
    icon: LockSimpleOpen,
    gradient: 'from-purple-500/30 via-purple-950 to-purple-950',
    badge: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30',
    pulse: 'bg-emerald-300',
    iconWrapper: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    action: 'bg-red-600 hover:bg-red-500 text-white focus-visible:ring-red-400',
    title: 'Refúgio aberto',
    helper: 'Lotação visível para estudantes.',
  },
  closed: {
    icon: LockSimple,
    gradient: 'from-blue-500/25 via-purple-950 to-purple-950',
    badge: 'bg-amber-500/15 text-amber-200 border border-amber-400/30',
    pulse: 'bg-amber-300',
    iconWrapper: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    action:
      'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:ring-emerald-400',
    title: 'Refúgio fechado',
    helper: 'Defina uma nova lotação ao abrir.',
  },
}

type PendingAction = 'status' | 'capacity' | null

type SystemStatusResponse = {
  isOpen: boolean
  capacityLevel: number
}

function useSystemStatus() {
  const [state, setState] = useState<{
    isOpen: boolean | null
    capacityLevel: number
  }>({ isOpen: null, capacityLevel: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/system/status')
      .then((res) => res.json())
      .then((data: SystemStatusResponse) => {
        setState({ isOpen: data.isOpen, capacityLevel: data.capacityLevel })
      })
      .catch((err) => {
        console.error('Failed to fetch status', err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function syncStatus(
    partialState: Partial<SystemStatusResponse>,
    action: PendingAction,
  ) {
    if (state.isOpen === null) return

    const previous = { ...state }
    const next = {
      isOpen:
        typeof partialState.isOpen === 'boolean'
          ? partialState.isOpen
          : previous.isOpen,
      capacityLevel:
        typeof partialState.capacityLevel === 'number'
          ? partialState.capacityLevel
          : previous.capacityLevel,
    }

    if (!next.isOpen) {
      next.capacityLevel = 0
    }

    if (
      next.isOpen === previous.isOpen &&
      next.capacityLevel === previous.capacityLevel
    ) {
      return
    }

    setState(next)
    setPendingAction(action)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/v1/system/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isOpen: next.isOpen,
          capacityLevel: next.capacityLevel,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update')
      }

      const payload: SystemStatusResponse = await res.json()
      setState({
        isOpen: payload.isOpen,
        capacityLevel: payload.capacityLevel,
      })
    } catch (error) {
      console.error('Failed to sync status', error)
      setState(previous)
      setErrorMessage('Não foi possível sincronizar. Tente novamente.')
    } finally {
      setPendingAction(null)
    }
  }

  function toggleStatus() {
    if (state.isOpen === null) return
    syncStatus({ isOpen: !state.isOpen }, 'status')
  }

  function updateCapacity(level: number) {
    if (state.isOpen === null || !state.isOpen) return
    syncStatus({ capacityLevel: level }, 'capacity')
  }

  return {
    isOpen: state.isOpen,
    capacityLevel: state.capacityLevel,
    isLoading,
    isToggling: pendingAction === 'status',
    isUpdatingCapacity: pendingAction === 'capacity',
    toggleStatus,
    updateCapacity,
    errorMessage,
  }
}

function StatusSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg shadow-black/40">
      <div className="relative z-10 flex flex-col gap-4 animate-pulse">
        <div className="h-5 w-1/3 rounded-full bg-zinc-800" />
        <div className="h-10 w-2/3 rounded-full bg-zinc-800" />
        <div className="h-16 w-full rounded-xl bg-zinc-800" />
      </div>
    </div>
  )
}

export function SystemStatusToggle() {
  const {
    isOpen,
    capacityLevel,
    isLoading,
    isToggling,
    isUpdatingCapacity,
    toggleStatus,
    updateCapacity,
    errorMessage,
  } = useSystemStatus()

  if (isLoading || isOpen === null) {
    return <StatusSkeleton />
  }

  const theme = isOpen ? STATUS_CONFIG.open : STATUS_CONFIG.closed
  const StatusIcon = theme.icon

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md shadow-2xl shadow-black/30">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`}
      />

      <div className="relative z-10 flex flex-col gap-6 text-white">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
              Painel administrador
            </p>
            <h2 className="text-2xl font-bold text-white">Status do Refúgio</h2>
            <p className="text-sm text-zinc-200/80">
              Controle em tempo real exibido na home.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${theme.badge}`}
            aria-live="polite"
          >
            <span
              className={`h-2 w-2 rounded-full ${theme.pulse} animate-pulse`}
            />
            {isOpen ? 'Aberto agora' : 'Fechado para ajustes'}
          </span>
        </header>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-white ${theme.iconWrapper}`}
            >
              <StatusIcon size={32} weight="bold" />
            </div>
            <div>
              <p className="text-sm text-zinc-300">Status exibido</p>
              <p className="text-xl font-semibold">{theme.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <ArrowClockwise size={18} weight="bold" className="text-zinc-200" />
            Atualizado em tempo real no site
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-zinc-300">{theme.helper}</span>

          <button
            onClick={toggleStatus}
            disabled={isToggling}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 ${theme.action}`}
          >
            {isToggling && <CircleNotch size={18} className="animate-spin" />}
            {isOpen ? 'Fechar Refúgio' : 'Abrir Refúgio'}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-widest">
                Lotação atual
              </p>
              <p className="text-lg font-semibold text-white">
                {isOpen ? `${capacityLevel}/5` : 'Indisponível'}
              </p>
            </div>

            <div className="flex gap-2">
              {CAPACITY_LEVELS.map((level) => {
                const isActive = isOpen && capacityLevel >= level
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateCapacity(level)}
                    disabled={!isOpen}
                    className={`rounded-xl border px-3 py-2 transition-all ${isActive
                      ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                      : 'border-white/10 text-zinc-400'
                      } ${!isOpen ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">{`Nível ${level}`}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: level }).map((_, index) => (
                        <User
                          key={`${level}-${index}`}
                          size={16}
                          weight="fill"
                          className="drop-shadow"
                        />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {!isOpen && (
            <p className="mt-3 text-sm text-amber-200/80">
              Abra o refúgio para definir a nova lotação.
            </p>
          )}

          {isOpen && isUpdatingCapacity && (
            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-200">
              <CircleNotch size={16} className="animate-spin" />
              Atualizando lotação...
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="text-zinc-200/80">
          <FormAnnotation>
            Esta ação controla o aviso principal do site e deve representar a
            disponibilidade real do espaço.
          </FormAnnotation>
        </div>
      </div>
    </div>
  )
}
