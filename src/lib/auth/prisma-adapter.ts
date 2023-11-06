/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { cookies } from 'next/headers'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      const cookieStore = cookies()
      const cookiesResponse = cookieStore.get('@refugiouniversitario:userId')

      if (!cookiesResponse?.value) {
        throw Error('cookies not found')
      }

      const userId = cookiesResponse?.value

      const prismaUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      cookies().delete('@refugiouniversitario:userId')

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
        course: prismaUser.course,
        education_level: prismaUser.education_level,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } })

      if (!user) {
        return null
      }

      if (!user.avatar_url || !user.email) {
        throw new Error('Error user avatar_url or user email')
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: null,
        avatar_url: user.avatar_url,
        course: user.course,
        education_level: user.education_level,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return null
      }

      if (!user.avatar_url || !user.email) {
        throw new Error('Error user avatar_url or user email')
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: null,
        avatar_url: user.avatar_url,
        course: user.course,
        education_level: user.education_level,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_id_provider_account_id: {
            provider_id: provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      if (!user.avatar_url || !user.email) {
        throw new Error('Error user avatar_url or user email')
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.avatar_url,
        emailVerified: null,
        avatar_url: user.avatar_url,
        course: user.course,
        education_level: user.education_level,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          course: user.course,
          education_level: user.education_level,
        },
      })

      if (!prismaUser.avatar_url || !prismaUser.email) {
        throw new Error('Error user avatar_url or user email')
      }

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url,
        course: prismaUser.course,
        education_level: prismaUser.education_level,
      }
    },

    async deleteUser(userId) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })
    },

    async linkAccount(account) {
      const today = new Date()
      const expiresAt = account.expires_at ?? null

      const accesTokenExpires = expiresAt
        ? new Date(today.getTime() + expiresAt)
        : null

      await prisma.account.create({
        data: {
          user_id: account.userId,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          provider_id: account.provider,
          provider_type: account.type,
          access_token_expires: accesTokenExpires,
        },
      })
    },

    // async unlinkAccount({ providerAccountId, provider }) {},

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
          course: user.course,
          education_level: user.education_level,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },

    // async createVerificationToken({ identifier, expires, token }) {},

    // async useVerificationToken({ identifier, token }) {},
  }
}
