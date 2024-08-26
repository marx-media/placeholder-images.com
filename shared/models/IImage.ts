import type { DocumentReference } from 'firebase-admin/firestore'
import type { IGeneration } from './IGeneration'
import type { ICategory } from './ICategory'
import type { IBase } from './IBase'

export interface IImageSecureData {
  url: string
}

export interface IImage {
  generation: DocumentReference<IGeneration, IBase<IGeneration>>
  category: DocumentReference<ICategory, IBase<ICategory>>
  image: string
  keyword: string
  downloads: number
  storagePath: string
  url: string
  secure?: IImageSecureData
}
