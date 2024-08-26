import { useValidatedBody, z } from 'h3-zod'
import { getGenerationService } from '~~/server/locator'

export default defineEventHandler(async (event) => {
  const { keyword } = await useValidatedBody(event, z.object({
    keyword: z.string(),
  }))

  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      statusText: 'Unauthorized',
    })
  }

  try {
    const service = getGenerationService(event.context.user.uid)
    const generationId = await service.createGeneration(keyword)
    return { generationId }
  } catch (error: any) {
    console.error(error)
    throw createError({
      ...error,
      status: 500,
      statusMessage: error.message,
      statusText: error.message,
      message: error.message,
    })
  }
})
