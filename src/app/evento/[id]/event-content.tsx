'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/container'
import { Header } from '@/components/header'
import { useSession } from 'next-auth/react'
import { CalendarBlank, Clock } from '@phosphor-icons/react'
import dayjs from '@/lib/dayjs'

interface EventContentProps {
  initialEventData: any
  initialUserData: any
  id: string
}

export default function EventContent({ initialEventData, initialUserData, id }: EventContentProps) {
  const { data: session } = useSession()

  const [eventData, setEventData] = useState<any>(initialEventData)
  const [userData, setUserData] = useState<any>(initialUserData)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async () => {
    setRegistering(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'MISSING_CELLPHONE') {
           setError('missing_cellphone')
        } else {
           setError(data.error || 'Erro ao confirmar presença.')
        }
      } else {
        setSuccess('Presença confirmada com sucesso!')
        setUserData({ ...userData, isRegistered: true })
        setEventData({ ...eventData })
      }
    } catch (err) {
      console.error(err)
      setError('Erro de conexão ao confirmar presença.')
    } finally {
      setRegistering(false)
    }
  }

  const dateObj = dayjs.utc(eventData.date)
  const dayOfMonth = dateObj.date()
  const monthName = dateObj.format('MMMM')
  const capMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  const line1 = `${dayOfMonth} de ${capMonthName}`
  
  const weekday = dateObj.format('dddd').split('-')[0]
  const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  const time = dateObj.format('HH[h]mm')
  const line2 = `${capWeekday} às ${time}`

  return (
    <>
      <div className="bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end min-h-[400px] w-full">
        <Header />
        <Container>
          <div className="pt-10 pb-20">
            <h1 className="font-plus-jakarta-sans font-semibold text-3xl md:text-[4rem] leading-[1.2] text-white py-3 text-center">
              {eventData.title}
            </h1>
            <p className="text-center text-white/80 text-lg mt-4 max-w-2xl mx-auto">
              Participe do nosso próximo evento no Refúgio Universitário.
            </p>
          </div>
        </Container>
      </div>
      
      <main className="bg-zinc-50 min-h-[500px]">
        <Container>
          <div className="max-w-2xl mx-auto -mt-16 pb-20">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 border border-zinc-100">
              
              <div className="text-zinc-700 text-lg leading-relaxed">
                {eventData.imageUrl && (
                  <div className="mb-8 overflow-hidden rounded-2xl shadow-sm border border-zinc-100 relative">
                    <img src={eventData.imageUrl} alt={eventData.title} className="w-full object-cover max-h-[400px]" />
                    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg border border-white/20">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <CalendarBlank size={20} weight="bold" className="text-purple-600" />
                          <p className="font-bold text-lg leading-tight text-zinc-900">{line1}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={20} weight="bold" className="text-purple-600" />
                          <p className="text-sm font-medium text-zinc-500">{line2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {eventData.description && (
                  <p className="mb-6 whitespace-pre-wrap">{eventData.description}</p>
                )}
                
                {!eventData.imageUrl && (
                  <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-zinc-100 mb-8 max-w-sm">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <CalendarBlank size={22} weight="bold" className="text-purple-600" />
                        <p className="font-bold text-xl leading-tight text-zinc-900">{line1}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={20} weight="bold" className="text-purple-600" />
                        <p className="text-base font-medium text-zinc-500">{line2}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                {userData?.isRegistered ? (
                   <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800 text-center font-medium flex flex-col items-center">
                     <span className="text-4xl mb-3">✅</span>
                     <p className="text-lg font-bold">Você já confirmou presença!</p>
                     <p className="text-sm mt-1 opacity-80">Nos vemos no evento.</p>
                   </div>
                ) : eventData.isFull ? (
                   <div className="bg-zinc-100 border border-zinc-200 p-6 rounded-2xl flex flex-col items-center text-center">
                     <p className="mb-2 text-zinc-600 font-bold text-lg">As vagas estão esgotadas!</p>
                     <p className="text-zinc-500 text-sm">A capacidade máxima para este evento já foi atingida.</p>
                   </div>
                ) : !session ? (
                   <div className="bg-yellow-50 p-6 border border-yellow-200 rounded-2xl flex flex-col items-center text-center">
                     <p className="mb-4 text-yellow-800 font-medium text-lg">Para confirmar sua presença, faça login na sua conta.</p>
                     <Link href={`/signup?callbackUrl=/evento/${id}`} className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-800 transition-colors shadow-lg">
                       Fazer Login
                     </Link>
                   </div>
                ) : (
                   <div className="flex flex-col items-center gap-4">
                     {error === 'missing_cellphone' ? (
                       <div className="bg-red-50 p-6 border border-red-200 rounded-2xl w-full text-center">
                         <h3 className="font-bold text-red-700 text-lg mb-2">Completar Perfil</h3>
                         <p className="text-red-700 mb-4">
                           Para confirmar presença, precisamos que informe seu número de celular no perfil (em caso de avisos ou sorteios).
                         </p>
                         <Link href="/profile" className="inline-block px-8 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition-colors">
                           Atualizar Meu Perfil
                         </Link>
                       </div>
                     ) : error ? (
                       <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl w-full text-center font-medium">
                         {error}
                       </div>
                     ) : null}

                     {success ? (
                       <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-xl w-full text-center font-bold">
                         {success}
                       </div>
                     ) : null}

                     {!success && (
                       <button
                         onClick={handleRegister}
                         disabled={registering}
                         className="w-full py-4 rounded-full font-bold text-black text-lg transition-all shadow-md bg-yellow-400 hover:bg-yellow-300 hover:scale-[1.02]"
                       >
                         {registering ? 'Confirmando...' : 'Quero Participar!'}
                       </button>
                     )}
                   </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
               <Link href="/" className="text-zinc-500 hover:text-zinc-800 font-medium hover:underline">
                 &larr; Voltar para a página inicial
               </Link>
            </div>
          </div>
        </Container>
      </main>
      
      <footer className="bg-white text-zinc-600 justify-center text-center p-6 text-sm border-t border-zinc-100">
        Confira nossa{' '}
        <Link className="underline hover:text-black" href={'/privacy-policy'}>
          Política de Privacidade
        </Link>{' '}
        e{' '}
        <Link className="underline hover:text-black" href={'/privacy-policy/term'}>
          Termos de Uso
        </Link>
      </footer>
    </>
  )
}
