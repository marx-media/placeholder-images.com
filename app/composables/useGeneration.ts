export const useGeneration = () => {
  const client = useSupabaseClient()

  const _error = ref(null)
  const error = computed(() => _error.value)

  const _currentStatus = ref<'IDLE' | 'PROGRESSING' | 'COMPLETED' | 'ERROR'>('IDLE')
  const currentStatus = computed(() => _currentStatus.value)

  const _currentImageIds = ref<string[]>([])
  const currentImageIds = computed(() => _currentImageIds.value)

  const _currentGenerationId = ref<string | null>(null)
  const currentGenerationId = computed(() => _currentGenerationId.value)

  const reset = () => {
    _error.value = null
    _currentImageIds.value = []
    _currentStatus.value = 'IDLE'
  }

  const listenToGenerations = (generationId: string) => {
    const subscription = client
      .channel(`generations:${generationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'generations', filter: `id=eq.${generationId}` },
        (payload) => {
          console.log(payload)
          const { new: generation } = payload
          _currentStatus.value = generation.status

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
          console.log(payload)
          const { new: image } = payload
          _currentImageIds.value = [..._currentImageIds.value, image.id]

          if (_currentImageIds.value.length === 1) {
          // cleanup
            subscription.unsubscribe()
            client.removeChannel(subscription)
          }
        }
      ).subscribe()
  }

  const createGeneration = async (prompt: string) => {
    reset()
    _currentStatus.value = 'PROGRESSING'
    const { data, error } = await client.from('generations').insert({ prompt }).select('*').single()
    if (error || !data) {
      _currentStatus.value = 'ERROR'
      throw error
    }

    listenToGenerations(data.id)
    listenToImages(data.id)
  }

  return {
    createGeneration,
    error,
    currentGenerationId,
    currentStatus,
    currentImageIds
  }
}
