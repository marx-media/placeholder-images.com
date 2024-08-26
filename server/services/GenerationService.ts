import type { Leonardo } from '@leonardo-ai/sdk'
import { JobStatus, SdGenerationSchedulers, SdGenerationStyle, SdVersions } from '@leonardo-ai/sdk/sdk/models/shared'
import { TransparencyType } from '@leonardo-ai/sdk/sdk/models/operations'
import { ItemService } from './ItemService'
import type { ImageService } from './ImageService'
import type { GenerationStatus, IGeneration } from '~~/shared/models'
import type { LeonardoGenerationEvent } from '~~/shared'

export class GenerationService extends ItemService<IGeneration> {
  constructor(userId: string, private leonardo: Leonardo, private imageService: ImageService) {
    super(userId, 'generations')
  }

  private async startLeonardoGeneration(keyword: string): Promise<string> {
    const result = await this.leonardo.image.createGeneration({
      prompt: `Create a high-contrast grayscaled, less detailed silhouette of a ${keyword}, depicted in a flat, two-dimensional vector graphic style, devoid of any intricate details or textures, against a flat gray gradient background that transitions from a dark charcoal gray at the top to a light misty gray at the bottom, with the silhouette itself rendered in a single, uniform darker gray tone, giving it a placeholder-like appearance, no hard gradient stops in background`,
      negativePrompt: 'shadow, lighting, high detailed',
      numImages: 1,
      width: 512,
      height: 512,
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
    })

    if (!result.object || !result.object.sdGenerationJob || !result.object.sdGenerationJob.generationId)
      throw new Error('Failed to start generation')

    return result.object.sdGenerationJob.generationId
  }

  async createGeneration(keyword: string): Promise<string> {
    const generationId = await this.startLeonardoGeneration(keyword)

    await this.setItem(generationId, {
      generationId,
      keyword,
      status: JobStatus.Pending
    })

    return generationId
  }

  async onGenerationEvent(event: LeonardoGenerationEvent) {
    const { data: { object: { id: generationId, status, images } } } = event

    if (status === JobStatus.Complete) {
      const generationRef = await this.getItem(generationId)

      await Promise.all(images.map(image => this.imageService.createImage(generationRef, image)))
    }

    await this.setGenerationStatus(generationId, status)
  }

  async setGenerationStatus(generationId: string, status: GenerationStatus): Promise<void> {
    await this.updateItem(generationId, { status })
  }
}
