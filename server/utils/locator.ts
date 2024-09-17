import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const useServerSupabaseClient = <T = Database>() => {
  const { supabase: { serviceKey }, public: { supabase: { url } } } = useRuntimeConfig()
  return createClient<T>(url, serviceKey)
}
