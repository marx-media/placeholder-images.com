export const useGenerationStore = defineStore('generations', () => {
  const { $api } = useNuxtApp()

  const generations = new Map<string, any>()

  const { } = useAsyncData('post:/api/generations', async () => $api(''))

  return {
    generations
  }
})
