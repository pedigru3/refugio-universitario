import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { signIn } from 'next-auth/react'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: '/signup',
  },
  adapter: PrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
        },
      },
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          username: '',
          avatar_url: profile.picture,
          course: '',
          education_level: '',
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account }) {
      if (
        !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
      ) {
        return '/signup/connect-google/?error=permissions'
      }

      return true
    },
    async session({ session, user, token }) {
      const expires = session.expires
      return {
        user: {
          email: user.email,
          image: user.avatar_url,
          name: user.name,
          username: user.username,
        },
        expires,
      }
    },
  },
}
