import type { QueryData } from '@supabase/supabase-js'
import type { Tables } from '~/types/database.types'

export interface FetchOptions {
  page?: number
  limit?: number
  category?: string
}

export const useImageStore = defineStore('images', () => {
  const client = useSupabaseClient()
  const query = client.from('images').select(`id,created_at,generation!inner(prompt,category!inner(slug))`)

  const items = ref<Map<string, QueryData<typeof query>[number]>>(new Map())
  const currentId = ref<string>('')
  const item = computed(() => items.value.get(unref(currentId)))

  const fetchList = async (options: FetchOptions = {}) => {
    const { page = 1, limit = 15, category = '' } = options
    // apply category filter
    if (category) query.eq('generation.category.slug', category)

    // apply sort and pagination
    const startIndex = (page - 1) * limit
    const endIndex = (page * limit) - 1
    query.order('created_at', { ascending: false }).range(startIndex, endIndex)

    // execute query
    const { data, error } = await query
    if (error) throw error
    data.forEach(item => items.value.set(item.id, item))
    return data
  }

  const fetchSingle = async (id: string) => {
    const { data, error } = await query.eq('id', id).single()
    if (error) throw error
    items.value.set(data.id, data)
    return data
  }

  const setCurrentItem = (id: string) => {
    currentId.value = id
  }

  const unsetCurrentItem = () => {
    currentId.value = ''
  }

  const listenToImagesByGenerationId = (generationId: string) => {
    const subscription = client
      .channel(`images:by_generation:${generationId}:${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'images', filter: `generation=eq.${generationId}` },
        async (payload: { new: Tables<'images'> }) => {
          const { new: image } = payload
          fetchSingle(image.id)

          // cleanup
          subscription.unsubscribe()
          client.removeChannel(subscription)
        }
      ).subscribe()
  }

  return {
    items,
    currentId,
    item,
    fetchList,
    fetchSingle,
    setCurrentItem,
    unsetCurrentItem,
    listenToImagesByGenerationId
  }
})
