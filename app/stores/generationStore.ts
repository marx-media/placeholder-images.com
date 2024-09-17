import type { QueryData } from '@supabase/supabase-js'
import type { Tables } from '~/types/database.types'

export const useGenerationStore = defineStore('generations', () => {
  const client = useSupabaseClient()

  const items: Ref<Map<string, Tables<'generations'>>> = ref(new Map())
  const currentId = ref<string>('')
  const item = computed(() => items.value.get(unref(currentId)))

  const listenToGenerationUpdates = (generationId: string) => {
    const subscription = client
      .channel(`generations:${generationId}:${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'generations', filter: `id=eq.${generationId}` },
        (payload: { new: Tables<'generations'> }) => {
          const generation = payload.new as Tables<'generations'>
          console.log('generation update', generation)

          items.value.set(generation.id, generation)

          // cleanup
          if (['COMPLETED', 'ERROR'].includes(generation.status)) {
            subscription.unsubscribe()
            client.removeChannel(subscription)
          }
        }
      ).subscribe()
  }

  const createSingle = async (prompt: string): Promise<string> => {
    const { data, error } = await client.from('generations').insert({ prompt }).select('id').single()
    if (error) throw error
    // @ts-expect-error ...
    items.value.set(data.id, { ...data, status: 'PROCESSING', prompt })
    currentId.value = data.id
    listenToGenerationUpdates(data.id)
    useImageStore().listenToImagesByGenerationId(data.id)
    return data.id
  }

  return {
    items,
    currentId,
    item,
    createSingle
  }
})
