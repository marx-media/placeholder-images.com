import type { SupabaseClient } from '@supabase/supabase-js'

export interface ServiceOptions {

}

export interface AbstractService {
  readonly client: SupabaseClient
}
