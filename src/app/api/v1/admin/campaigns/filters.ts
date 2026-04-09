import { Prisma } from '@prisma/client'

export type CampaignFilter =
  | 'all'
  | 'active'
  | 'inactive'
  | 'never_scheduled'
  | 'no_checkin'

export function buildUsersWhere(
  filter: string,
): Prisma.UserWhereInput {
  const now = new Date()

  // Base: all users with an email address
  const base: Prisma.UserWhereInput = {
    email: { not: null },
  }

  switch (filter as CampaignFilter) {
    case 'active':
      return { ...base, expires_at: { gte: now } }

    case 'inactive':
      return { ...base, expires_at: { lt: now } }

    case 'never_scheduled':
      return { ...base, Scheduling: { none: {} } }

    case 'no_checkin':
      // Has at least one scheduling, but none with a check_in
      return {
        ...base,
        Scheduling: {
          some: {},
          none: { check_in: { not: null } },
        },
      }

    case 'all':
    default:
      return base
  }
}
