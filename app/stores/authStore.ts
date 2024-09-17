import type { Session, User } from '@supabase/auth-js'
import type { Tables } from '~/types/database.types'

export const useAuthStore = defineStore('auth', () => {
  const client = useSupabaseClient()

  const currentUser = ref<User | null>(null)
  const currentSubscription = ref<Tables<'subscriptions'> | null>(null)

  const signUp = async (username: string, email: string, password: string) => {
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: username } } })
    if (error) throw error

    currentUser.value = data.user
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error

    currentUser.value = data.user
    return data
  }

  const getSubscription = async (user_id: string) => {
    const { data, error } = await client.from('subscriptions').select('*').eq('id', user_id).single()
    if (error) throw error
    currentSubscription.value = data
    return data
  }

  const getMe = async () => {
    const { data: { user } } = await client.auth.getUser()

    await getSubscription(user.id)
    currentUser.value = user
    return { user }
  }

  return {
    currentUser,
    signUp,
    signIn,
    getMe
  }
})
