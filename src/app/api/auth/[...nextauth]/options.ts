import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { cookies } from 'next/headers'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signup',
  },
  adapter: PrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      httpOptions: {
        timeout: 10000,
      },
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
          role: profile.role ?? 'user',
          cellphone: null,
          birthday: null,
          expires_at: null,
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, profile }) {
      const cookieStore = await cookies()
      const pendingUser = cookieStore.get('@refugiouniversitario:userId')

      // Se existe pré-cadastro em cookie, permite prosseguir direto
      if (pendingUser) {
        return true
      }

      if (
        !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
      ) {
        return '/signup/connect-google/?error=permissions'
      }

      if (account?.provider === 'google' && profile?.email) {
        const googleProfile = profile as GoogleProfile

        const userExists = await prisma.user.findUnique({
          where: { email: profile.email },
        })

        if (!userExists) {
          return '/signup?error=unregistered'
        }

        if (
          googleProfile.picture &&
          userExists.avatar_url !== googleProfile.picture
        ) {
          await prisma.user.update({
            where: { email: profile.email },
            data: { avatar_url: googleProfile.picture },
          })
        }
      }

      return true
    },
    async session({ session, user }) {
      const expires = session.expires

      return {
        user: {
          id: user.id,
          email: user.email,
          image: user.avatar_url,
          name: user.name,
          username: user.username,
          role: user.role,
          course: user.course,
          education_level: user.education_level,
          cellphone: user.cellphone,
          birthday: user.birthday,
          expires_at: user.expires_at,
        },
        expires,
      }
    },
  },
}
