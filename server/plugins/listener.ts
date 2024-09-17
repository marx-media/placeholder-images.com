import { createClient } from '@supabase/supabase-js'
import { get } from 'lodash-es'
import type { Tables } from '~/types/database.types'
import { useCategoryService } from '../services/CategoryService'
import { useGenerationService } from '../services/GenerationService'
import { useImageService } from '../services/ImageService'
import { useLeonardoService } from '../services/LeonardoService'
import { useSubscriptionService } from '../services/SubscriptionService'

export default defineNitroPlugin(() => {
  const { supabase: { serviceKey }, public: { supabase: { url } } } = useRuntimeConfig()
  const client = createClient(url, serviceKey)

  client.channel('generations').on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'generations'
  }, async (payload) => {
    const { id, prompt, created_by } = payload.new as Tables<'generations'>

    const { getAllowedParallelGenerationsByUser } = useSubscriptionService()
    const { createOrUpdateCategory } = useCategoryService()
    const { setGenerationInfo } = useGenerationService()
    const { storeImages } = useImageService()
    const { createLeonardoGeneration, waitForLeonardoGeneration } = useLeonardoService()

    try {
      const numImages = await getAllowedParallelGenerationsByUser(created_by)
      await setGenerationInfo(id, { image_count: numImages })

      const leonardo_generation_id = await createLeonardoGeneration({ prompt, numImages })
      const images = await waitForLeonardoGeneration(leonardo_generation_id)

      const category = await createOrUpdateCategory(prompt)

      await storeImages(id, images)
      await setGenerationInfo(id, { leonardo_generation_id, category, status: 'COMPLETED' })
    } catch (error: any) {
      if (error.body) {
        const parsed = JSON.parse(error.body)
        await setGenerationInfo(id, { status: 'ERROR', error: parsed })
      } else {
        await setGenerationInfo(id, { status: 'ERROR', error: { code: 'unknown' } })
      }
    }
  }).subscribe()
})
