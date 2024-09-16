import { createClient } from '@supabase/supabase-js'

export const useServerSupabaseClient = <T = any>() => {
  const { supabase: { serviceKey }, public: { supabase: { url } } } = useRuntimeConfig()
  return createClient<T>(url, serviceKey)
}
