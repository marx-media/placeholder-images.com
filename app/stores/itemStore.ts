export type GenerationStatus = 'IDLE' | 'PROGRESSING' | 'COMPLETED' | 'ERROR'

const IMAGE_COUNT = 1

export const useItemStore = defineStore('item', () => {
  const client = useSupabaseClient()

  const items = ref<Map<string, any>>(new Map())
  const currentItemId = ref<string>('')
  const currentItem = computed(() => items.value.get(currentItemId.value))

  const currentGeneration = ref<any | null>(null)

  const currentStatus = ref<GenerationStatus>('IDLE')
  const currentImages = ref<string[]>([])

  const listenToGeneration = (generationId: string) => {
    const subscription = client
      .channel(`generations:${generationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'generations', filter: `id=eq.${generationId}` },
        (payload) => {
          const { new: generation } = payload
          currentGeneration.value = generation
          currentStatus.value = generation.status

          // cleanup
          subscription.unsubscribe()
          client.removeChannel(subscription)
        }
      ).subscribe()
  }

  const listenToImages = (generationId: string) => {
    const subscription = client
      .channel(`images:${generationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'images', filter: `generation=eq.${generationId}` },
        (payload) => {
          const { new: image } = payload
          currentImages.value = [...currentImages.value, image.id]

          if (currentImages.value.every(id => id.length > 5)) {
          // cleanup
            subscription.unsubscribe()
            client.removeChannel(subscription)
          }
        }
      ).subscribe()
  }

  const createImages = async (prompt: string) => {
    const { data, error } = await client.from('generations').insert({ prompt }).select('*').single()
    if (error || !data) {
      currentStatus.value = 'ERROR'
      throw error
    }

    // add IMAGE_COUNT number of random strings (length 4) into the currentImages array
    currentImages.value = Array.from({ length: IMAGE_COUNT }, () => Math.random().toString(36).substring(2, 6))

    listenToGeneration(data.id)
    listenToImages(data.id)
  }

  const fetchImages = async (options: FetchOptions = {}) => {
    const { page = 1, limit = 15, category = '' } = options
    const startIndex = (page - 1) * limit
    const endIndex = (page * limit) - 1

    const query = client.from('images').select(`
      id,
      generation!inner(
        category!inner(
          slug
        )
      )
    `)

    if (category) {
      query.eq('generation.category.slug', category)
    }
    query.order('created_at', { ascending: false }).range(startIndex, endIndex)

    const { data, error } = await query

    if (error) throw error

    data.forEach((item: any) => {
      items.value.set(item.id, item)
    })
    return data
  }

  const fetchImage = async (id: string) => {
    const { data, error } = await client.from('images').select(`
      id,
      created_at,
      generation!inner(
        prompt, 
        category!inner(
          slug
        )
      )
    `).eq('id', id).single()

    if (error) throw error

    items.value.set(data.id, data)
    return data
  }

  const setCurrentItem = (id: string) => {
    currentItemId.value = id
    fetchImage(id).then(() => true)
  }

  const unsetCurrentItem = () => {
    currentItemId.value = ''
  }

  return {
    createImages,
    items,
    currentItemId,
    currentItem,
    currentGeneration,
    setCurrentItem,
    unsetCurrentItem,
    fetchImages
  }
})
