import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { ItemService } from './ItemService'
import type { CategoryService } from './CategoryService'
import type { StorageService } from './StorageService'
import type { IImage } from '~~/shared/models/IImage'
import type { LenoardoImageMeta } from '~~/shared'

export class ImageService extends ItemService<IImage> {
  constructor(private categoryService: CategoryService, private storageService: StorageService) {
    super('', 'images')
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`Error downloading picture: ${response.statusText}`)

    const imageBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)

    return buffer
  }

  private resizeImage(buffer: Buffer, width: number = 300): Promise<Buffer> {
    return sharp(buffer).resize(width).webp({ quality: 60 }).toBuffer()
  }

  async createImage(generation: any, image: LenoardoImageMeta): Promise<void> {
    const buffer = await this.downloadImage(image.url)
    const resizedBuffer = await this.resizeImage(buffer)

    const { keyword, createdBy } = await generation.data()!
    const category = await this.categoryService.createCategoryFromKeyword(keyword as string)

    this.setUserId(createdBy?.id)
    // const firebaseService = new FirebaseService<IImage>('images', createdBy.id)

    const uploadedFile = await this.storageService.uploadFile(resizedBuffer, `thumbnail/${image.id}.webp`)
    await uploadedFile.makePublic()
    const publicUrl = await uploadedFile.publicUrl()

    const docRef = await this.addItem({
      generation: generation.ref,
      image: image.id,
      category: category.ref,
      downloads: 0,
      keyword,
      storagePath: uploadedFile.name,
      url: publicUrl,
    })
  }
}
