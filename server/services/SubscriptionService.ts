export const useSubscriptionService = () => {
  const client = useServerSupabaseClient()

  const getSubscriptionForUser = async (user_id: string) => {
    const { data, error } = await client.from('subscriptions').select('*').eq('id', user_id).single()
    if (error) throw error
    return data
  }

  const getAllowedParallelGenerationsByUser = async (user_id: string | null) => {
    if (!user_id) return 1

    const { data, error } = await client.from('subscriptions').select('plan').eq('id', user_id).single()
    if (error) throw error
    switch (data.plan) {
      case 'FREE': return 1
      case 'PRO': return 2
      case 'PREMIUM': return 4
    }
    return 1
  }

  return {
    getSubscriptionForUser,
    getAllowedParallelGenerationsByUser
  }
}
