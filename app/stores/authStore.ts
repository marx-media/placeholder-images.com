import type { Session, User } from '@supabase/auth-js'

export const useAuthStore = defineStore('auth', () => {
  const client = useSupabaseClient()

  const currentSession = ref<Session | null>(null)
  const currentUser = ref<User | null>(null)

  const signUp = async (username: string, email: string, password: string) => {
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: username } } })
    if (error) throw error
    currentSession.value = data.session
    currentUser.value = data.user
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
    currentSession.value = data.session
    currentUser.value = data.user
    return data
  }

  const getMe = async () => {
    const { data: { user } } = await client.auth.getUser()

    currentUser.value = user
    return { user }
  }

  return {
    currentSession,
    currentUser,
    signUp,
    signIn,
    getMe
  }
})
