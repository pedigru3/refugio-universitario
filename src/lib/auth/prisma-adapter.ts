import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {},

    async getUser(id) {
      const user = await prisma.user.findFirstOrThrow({ where: { id } })

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
    async getUserByEmail(email) {
      const user = await prisma.user.findFirstOrThrow({ where: { email } })

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
    async getUserByAccount({ providerAccountId, provider }) {},
    async updateUser(user) {},
    async deleteUser(userId) {},
    async linkAccount(account) {},
    async unlinkAccount({ providerAccountId, provider }) {},
    async createSession({ sessionToken, userId, expires }) {},
    async getSessionAndUser(sessionToken) {},
    async updateSession({ sessionToken }) {},
    async deleteSession(sessionToken) {},
    async createVerificationToken({ identifier, expires, token }) {},
    async useVerificationToken({ identifier, token }) {},
  }
}
