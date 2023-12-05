// eslint-disable-next-line camelcase
import { Inter, Plus_Jakarta_Sans, Kalam } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  weight: ['500', '600'],
})

export const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-kalam',
})
