import type { Tables } from '~/types/database.types'

export const getParallelImageCountFromSubscription = (subscription: Tables<'subscriptions'>): number => {
  switch (subscription.plan) {
    case 'FREE': return 1
    case 'PRO': return 2
    case 'PREMIUM': return 4
  }
  return 0
}
