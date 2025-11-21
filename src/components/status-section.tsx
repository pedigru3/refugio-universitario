'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { Clock, UsersThree, DoorOpen, Door, User } from '@phosphor-icons/react'

dayjs.locale('pt-br')

const CAPACITY_COLORS = [
  { text: 'text-emerald-300', bar: 'bg-emerald-300' },
  { text: 'text-emerald-200', bar: 'bg-emerald-200' },
  { text: 'text-amber-300', bar: 'bg-amber-300' },
  { text: 'text-orange-300', bar: 'bg-orange-300' },
  { text: 'text-rose-300', bar: 'bg-rose-300' },
] as const

type SystemStatusResponse = {
  isOpen: boolean
  capacityLevel: number
}

export function StatusSection() {
  const [time, setTime] = useState<dayjs.Dayjs | null>(null)
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [capacityLevel, setCapacityLevel] = useState<number | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/v1/system/status')
        const data: SystemStatusResponse = await res.json()
        setIsOpen(data.isOpen)
        setCapacityLevel(data.capacityLevel)
      } catch (error) {
        console.error('Failed to fetch status', error)
      }
    }

    fetchStatus()

    const statusInterval = setInterval(fetchStatus, 10000)
    const clockInterval = setInterval(() => setTime(dayjs()), 1000)

    // garante que o primeiro valor só é definido no cliente
    setTime(dayjs())

    return () => {
      clearInterval(clockInterval)
      clearInterval(statusInterval)
    }
  }, [])

  const capacityStyles =
    capacityLevel && capacityLevel > 0
      ? CAPACITY_COLORS[Math.min(capacityLevel, 5) - 1]
      : { text: 'text-gray-400', bar: 'bg-white/20' }

  const renderCapacityIcons = () => {
    // 1. Estado de Carregamento (Sem Mudanças)
    if (capacityLevel === null || isOpen === null) {
      return (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map(
            (
              _,
              index, // Ajustado para 5 loaders
            ) => (
              <div
                key={index}
                className="h-6 w-6 animate-pulse rounded-md bg-white/20"
              />
            ),
          )}
        </div>
      )
    }

    // 2. Estado Fechado ou Vazio (Sem Mudanças)
    if (!isOpen || capacityLevel === 0) {
      return <span className="text-sm text-gray-300">Sem visitantes</span>
    }

    // 3. Estado Normal (Com a Nova Lógica)
    // Definimos o número total de ícones a serem exibidos.
    const MAX_ICONS = 5

    // Calcula o número de ícones transparentes (vazios).
    // O valor não deve ser menor que zero.
    const transparentIcons = Math.max(0, MAX_ICONS - capacityLevel)

    // Usa um array de tamanho MAX_ICONS para iterar sobre todos os ícones.
    return (
      <div className={`flex gap-2 ${capacityStyles.text}`}>
        {
          // Renderiza os ícones preenchidos (coloridos)
          Array.from({ length: capacityLevel }).map((_, index) => (
            <User
              key={`filled-${index}`}
              size={22}
              weight="fill" // Ícone preenchido
            />
          ))
        }
        {
          // Renderiza os ícones transparentes (vazios)
          Array.from({ length: transparentIcons }).map((_, index) => (
            <User
              key={`transparent-${index}`}
              size={22}
              // Usamos 'light' ou 'thin' ou 'regular' para o ícone vazio
              // E aplicamos uma classe para torná-lo transparente/cinza
              weight="light"
              className="text-white/30" // Cor mais transparente ou cinza
            />
          ))
        }
      </div>
    )
  }

  return (
    <div className="w-full mt-5 max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 text-gray-200 mb-1">
            <Clock size={24} />
            <span className="text-sm font-medium uppercase tracking-wider">
              Horário Atual
            </span>
          </div>
          <div className="text-4xl font-bold font-mono tracking-widest">
            {time ? time.format('HH:mm:ss') : '--:--:--'}
          </div>
          <div className="text-sm text-gray-300 mt-1 capitalize">
            {time ? time.format('dddd, D [de] MMMM') : 'Atualizando...'}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 text-gray-200 mb-1">
            {isOpen ? <DoorOpen size={24} /> : <Door size={24} />}
            <span className="text-sm font-medium uppercase tracking-wider">
              Status
            </span>
          </div>
          {isOpen === null ? (
            <div className="h-9 w-32 animate-pulse rounded-full bg-white/20" />
          ) : (
            <div
              className={`px-4 py-1 rounded-full text-lg font-bold shadow-lg ${
                isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isOpen ? 'ABERTO' : 'FECHADO'}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-gray-200 mb-1">
            <UsersThree size={24} />
            <span className="text-sm font-medium uppercase tracking-wider">
              Lotação
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            {renderCapacityIcons()}
            <div className="w-full max-w-[160px]">
              <div className="h-2.5 rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${capacityStyles.bar}`}
                  style={{
                    width:
                      capacityLevel && isOpen
                        ? `${Math.min(capacityLevel, 5) * 20}%`
                        : isOpen
                        ? '4%'
                        : '0%',
                    opacity:
                      capacityLevel === null || isOpen === null ? 0.4 : 1,
                  }}
                />
              </div>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-gray-300">
                {capacityLevel === null || isOpen === null ? 'Atualizando' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
