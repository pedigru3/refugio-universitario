/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { prisma } from './prisma'

export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      user_id: userId,
      provider_id: 'google',
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  const expiryDate = account.access_token_expires
    ? new Date().getTime() - new Date(account.access_token_expires).getTime()
    : 1000 * 60 * 60

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: expiryDate,
  })

  if (!account.access_token_expires) {
    return auth
  }

  const isTokenExpired = dayjs(expiryDate).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        access_token_expires: dayjs(expiry_date).toDate(),
        refresh_token,
      },
    })

    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    })
  }

  return auth
}
