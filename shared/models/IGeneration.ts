import type { JobStatus } from '@leonardo-ai/sdk/sdk/models/shared'

export type GenerationStatus = JobStatus

export interface IGeneration {
  generationId: string
  keyword: string
  status: GenerationStatus
}
