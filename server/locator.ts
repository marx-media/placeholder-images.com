import { Leonardo } from '@leonardo-ai/sdk'
import { OpenAI } from 'openai'
import { ImageService } from './services/ImageService'
import { CategoryService } from './services/CategoryService'
import { GenerationService } from './services/GenerationService'
import { StorageService } from './services/StorageService'

let __openAi: OpenAI
let __lenoardo: Leonardo
let __storageService: StorageService

export const getOpenAiService = () => {
  if (!__openAi) {
    const { openAi: { apiKey, organisationId, projectId } } = useRuntimeConfig()
    __openAi = new OpenAI({
      apiKey,
      organization: organisationId,
      project: projectId
    });
  }
  return __openAi
}

export const getLeonardoService = () => {
  if (!__lenoardo) {
    const { leonardoApiKey } = useRuntimeConfig()
    __lenoardo = new Leonardo({
      bearerAuth: leonardoApiKey
    })
  }
  return __lenoardo
}

export const getStorageService = () => {
  if (!__storageService) {
    __storageService = new StorageService()
  }
  return __storageService
}

export const getCategoryService = (userId: string) => {
  return new CategoryService(userId, getOpenAiService())
}

export const getImageService = (userId: string) => {
  return new ImageService(getCategoryService(userId), getStorageService())
}

export const getGenerationService = (userId: string) => {
  return new GenerationService(userId, getLeonardoService(), getImageService(userId))
}
