import { createClient } from '@supabase/supabase-js'
import { useCategoryService } from '../services/CategoryService'
import { useGenerationService } from '../services/GenerationService'
import { useImageService } from '../services/ImageService'
import { useLeonardoService } from '../services/LeonardoService'

export default defineNitroPlugin(() => {
  const { supabase: { serviceKey }, public: { supabase: { url } } } = useRuntimeConfig()
  const client = createClient(url, serviceKey)

  client.channel('generations').on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'generations'
  }, async (payload) => {
    const { id, prompt } = payload.new

    const { createOrUpdateCategory } = useCategoryService()
    const { setGenerationStatus, setGenerationInfo } = useGenerationService()
    const { storeImages } = useImageService()
    const { createLeonardoGeneration, waitForLeonardoGeneration } = useLeonardoService()

    try {
      const leonardo_generation_id = await createLeonardoGeneration({ prompt })
      const images = await waitForLeonardoGeneration(leonardo_generation_id)

      const category = await createOrUpdateCategory(prompt)

      await storeImages(id, images)
      await setGenerationInfo(id, { leonardo_generation_id, category, status: 'COMPLETED' })
    } catch (error: any) {
      console.log(error)
      await setGenerationStatus(id, 'ERROR')
    }
  }).subscribe()
})
