// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth/next'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    username: string
    email: string
    course: string
    education_level: string
    avatar_url: string
    role: string
  }

  interface Session {
    user: User
  }
}
