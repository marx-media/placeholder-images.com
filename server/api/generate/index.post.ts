import { getGenerationService, getImageService } from '~~/server/locator'
import type { LeonardoGenerationEvent } from '~~/shared'

export default defineEventHandler<{
  body: LeonardoGenerationEvent
}>(async (event) => {
  const body = await readBody(event)

  if (body.type !== 'image_generation.complete' || body.object !== 'generation') {
    console.warn('Invalid event type', body)
    return 400
  }

  try {
    const generationService = getGenerationService('leonardo')
    await generationService.onGenerationEvent(body)
    return 201
  } catch (error: any) {
    console.error(error)
    return 500
  }
})
