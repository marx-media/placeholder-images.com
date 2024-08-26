import type { DocumentData, DocumentReference, WithFieldValue } from 'firebase/firestore'
import type { IUser } from './IUser'

export type AnyItem = DocumentData & {
  id?: string
}

export type IBase<T extends AnyItem> = WithFieldValue<T> & {
  createdAt: Date
  updatedAt: Date | null
  createdBy: DocumentReference<IUser> | string | null
  updatedBy: DocumentReference<IUser> | string | null
}

export type WithId<T extends AnyItem> = IBase<T> & { id: string }
