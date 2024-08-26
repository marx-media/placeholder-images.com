import type { Buffer } from 'node:buffer'
import { ensureAdminApp } from 'vuefire/server'
import { type Storage, getStorage } from 'firebase-admin/storage'

export class StorageService {
  private storage: Storage
  constructor() {
    const runtimeConfig = useRuntimeConfig()

    const adminApp = ensureAdminApp({
      projectId: runtimeConfig.public.vuefire!.config!.projectId,
      ...runtimeConfig.vuefire?.admin?.options,
    }, 'admin-item-service')

    this.storage = getStorage(adminApp)
  }

  public async uploadFile(buffer: Buffer, path: string) {
    const bucket = this.storage.bucket('placeholder-image.appspot.com')
    const file = bucket.file(path)
    await file.save(buffer)
    return file
  }
}
