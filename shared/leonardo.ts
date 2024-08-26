import type { JobStatus } from '@leonardo-ai/sdk/sdk/models/shared'

export interface LenoardoImageMeta {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  url: string
  generationId: string
  nobgId: string | null
  nsfw: boolean
  likeCount: number
  trendingScore: number
  public: boolean
}

export interface LeonardoGenerationEvent {
  type: 'image_generation.complete'
  object: 'generation'
  timestamp: number
  api_version: string
  data: {
    object: {
      id: string
      createdAt: string
      updatedAt: string
      userId: string
      public: boolean
      flagged: boolean
      nsfw: boolean
      status: JobStatus
      coreModel: string
      guidanceScale: number
      imageHeight: number
      imageWidth: number
      inferenceSteps: number
      initGeneratedImageId: string | null
      initImageId: string | null
      initStrength: number | null
      initType: string | null
      initUpscaledImageId: string | null
      modelId: string
      negativePrompt: string
      prompt: string
      quantity: number
      sdVersion: string
      tiling: boolean
      imageAspectRatio: string | null
      tokenCost: number
      negativeStylePrompt: string
      seed: string
      scheduler: string
      presetStyle: string | null
      promptMagic: boolean
      canvasInitImageId: string | null
      canvasMaskImageId: string | null
      canvasRequest: boolean
      api: boolean
      poseImage2Image: boolean
      imagePromptStrength: number | null
      category: string | null
      poseImage2ImageType: string | null
      highContrast: boolean
      apiDollarCost: string
      poseImage2ImageWeight: number | null
      alchemy: string | null
      contrastRatio: number | null
      highResolution: boolean | null
      expandedDomain: string | null
      promptMagicVersion: string | null
      unzoom: string | null
      unzoomAmount: number | null
      apiKeyId: string
      photoReal: boolean
      promptMagicStrength: number | null
      photoRealStrength: number | null
      imageToImage: boolean
      controlnetsUsed: boolean
      model: {
        id: string
        createdAt: string
        updatedAt: string
        name: string
        description: string
        public: boolean
        userId: string
        flagged: boolean
        nsfw: boolean
        official: boolean
        status: string
        classPrompt: string | null
        coreModel: string
        initDatasetId: string | null
        instancePrompt: string | null
        sdVersion: string
        trainingEpoch: number | null
        trainingSteps: number | null
        tokenCost: number | null
        batchSize: number
        learningRate: number | null
        type: string
        modelHeight: number
        modelWidth: number
        leonardoInstancePrompt: string | null
        trainingStrength: string
        featured: boolean
        featuredImageId: string | null
        featuredPosition: number
        api: boolean
        favouriteCount: number
        imageCount: number
        enhancedModeration: boolean
        apiDollarCost: number | null
        apiKeyId: string | null
        modelLRN: string | null
      }
      images: Array<LenoardoImageMeta>
      apiKey: {
        id: string
        createdAt: string
        userId: string
        key: string
        lastUsed: string
        name: string
        type: string
        webhookCallbackUrl: string
        webhookCallbackApiKey: string
      }
    }
  }
}
