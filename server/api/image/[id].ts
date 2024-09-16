import { useImageService } from '~~/server/services/ImageService'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  const client = useServerSupabaseClient()
  const { fetchImage, processImage } = useImageService()
  const { public: { siteUrl } } = useRuntimeConfig()
  const referer = getHeader(event, 'Referer')

  if (!referer) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  const url = new URL(referer)
  if (!['localhost', (new URL(siteUrl)).hostname].includes(url.hostname)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  const { data, error } = await client.from('image_meta').select('*').eq('image', id).single()
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch image'
    })
  }

  const buffer = await processImage(await fetchImage(data.url), {
    ...query
  })

  setHeader(event, 'Content-Type', 'image/webp')
  return buffer
})
