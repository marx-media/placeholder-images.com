export const useGenerationStore = defineStore('generations', () => {
  const { $api } = useNuxtApp()

  const generations = ref<Map<string, any>>(new Map<string, any>())

  const createGeneration = async (keyword: string) => {
    const { } = await $api('/api/generations', {
      method: 'PUT',
      body: { keyword }
    })
  }
  // const generate = (keyword: Ref<string>) =>

  return {
    // generations,
    // generate
  }
})
