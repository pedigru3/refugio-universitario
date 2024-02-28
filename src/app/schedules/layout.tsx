'use client'

import { Header } from '@/components/header'
import { ScheduleContextProvider } from '@/context/schedule-provider'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-tr from-gradient-start via-gradient-middle via-60% to-gradient-end">
      <div className="shadow-lg">
        <Header />
      </div>
      <div className=" w-full min-h-screen py-5">
        <ScheduleContextProvider>{children}</ScheduleContextProvider>
      </div>
    </div>
  )
}
