import type { CreateGenerationRequestBody, GeneratedImages } from '@leonardo-ai/sdk/sdk/models/operations/index.js'
import { Leonardo } from '@leonardo-ai/sdk'
import { TransparencyType } from '@leonardo-ai/sdk/sdk/models/operations/index.js'
import { SdGenerationSchedulers, SdGenerationStyle, SdVersions } from '@leonardo-ai/sdk/sdk/models/shared/index.js'
import { get } from 'lodash-es'
import { sleep } from '../utils/sleep'

export interface GenerationOptions {
  prompt: string
  numImages: number
}

export const useLeonardoService = () => {
  const { leonardoApiKey: bearerAuth = '' } = useRuntimeConfig()
  if (!bearerAuth) {
    throw new Error('Missing required Leonardo API key')
  }
  const client = new Leonardo({ bearerAuth })

  const getPromt = (prompt: string) => `Create a high-contrast grayscaled, less detailed silhouette of a ${prompt}, depicted in a flat, two-dimensional vector graphic style, devoid of any intricate details or textures, against a flat gray gradient background that transitions from a dark charcoal gray at the top to a light misty gray at the bottom, with the silhouette itself rendered in a single, uniform darker gray tone, giving it a placeholder-like appearance, no hard gradient stops in background`

  const getImageGenerationPayload = (options: GenerationOptions): CreateGenerationRequestBody => {
    const { prompt, numImages } = options
    return {
      prompt: getPromt(prompt),
      negativePrompt: 'shadow, lighting, high detailed',
      numImages,
      width: 1024,
      height: 576,
      numInferenceSteps: 10,
      guidanceScale: 7,
      sdVersion: SdVersions.Sdxl09,
      modelId: '2067ae52-33fd-4a82-bb92-c2c55e7d2786',
      presetStyle: SdGenerationStyle.Leonardo,
      scheduler: SdGenerationSchedulers.Leonardo,
      public: false,
      tiling: false,
      weighting: 0.75,
      highContrast: false,
      photoReal: false,
      transparency: TransparencyType.Disabled,
      alchemy: true
    } as CreateGenerationRequestBody
  }

  const createLeonardoGeneration = async (options: GenerationOptions): Promise<string> => {
    const payload = getImageGenerationPayload(options)
    const result = await client.image.createGeneration(payload)
    const generationId = get(result, 'object.sdGenerationJob.generationId', null)
    if (!generationId)
      throw new Error('Failed to create Leonardo generation')
    return generationId
  }

  const waitForLeonardoGeneration = async (generationId: string): Promise<GeneratedImages[]> => {
    let generatedImages: GeneratedImages[] = []
    do {
      await sleep(1000)
      const result = await client.image.getGenerationById(generationId)
      generatedImages = get(result, 'object.generationsByPk.generatedImages', [])
    } while (generatedImages.length === 0)

    return generatedImages
  }

  return {
    createLeonardoGeneration,
    waitForLeonardoGeneration
  }
}
