import { Header } from '@/components/header'

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-400  h-screen">
      <Header />
      {children}
    </div>
  )
}
