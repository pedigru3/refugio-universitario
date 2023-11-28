// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      username: string
      email: string
      image?: string
    }
  }
}
