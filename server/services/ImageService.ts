import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import type { GeneratedImages } from '@leonardo-ai/sdk/sdk/models/operations'
import { useServerSupabaseClient } from '../utils/locator'

export const useImageService = () => {
  const client = useServerSupabaseClient()

  const storeImage = async (generation_id: string, image: GeneratedImages) => {
    const { data: img, error: imgError } = await client.from('images').insert({
      generation: generation_id
    }).select('*').single()
    if (imgError) throw imgError

    const { data: meta, error: metaError } = await client.from('image_meta').insert({
      image: img.id,
      url: image.url
    }).select('*').single()
    if (metaError) throw metaError

    return {
      ...img,
      image_meta: meta
    }
  }
  const storeImages = async (generation_id: string, images: GeneratedImages[]) => {
    return Promise.all(images.map(image => storeImage(generation_id, image)))
  }

  const fetchImage = async (url: string) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  const processImage = async (buffer: Buffer, options: any): Promise<Buffer> => {
    let { width = 600, fit = 'cover', ratio = '16/9', quality = 80, grayscale = 'false' } = options

    width = Number(width)
    quality = Number(quality)

    let image = sharp(buffer)

    if (width) {
      const [y, x] = ratio.split('/').map((v: string) => v.trim()).map((v: string) => Number.parseInt(v))
      const height = Math.floor(width * x / y)
      image = image.resize({
        width: Number(width),
        height: Number(height),
        fit
      })
    }
    if (quality) {
      image = image.webp({ quality })
    }

    if (grayscale === 'true') {
      image = image.grayscale()
    }

    return await image.toBuffer()
  }

  return {
    storeImage,
    storeImages,
    fetchImage,
    processImage
  }
}
