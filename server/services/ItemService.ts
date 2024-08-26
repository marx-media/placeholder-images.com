import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore'
import type { CollectionReference, DocumentReference, DocumentSnapshot, Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { ensureAdminApp } from 'vuefire/server'
import type { AnyItem, WithId } from '~~/shared/models'

export class ItemService<Item extends AnyItem = AnyItem> {
  private db: Firestore
  private colRef: CollectionReference<Item, WithId<Item>>

  constructor(private userId: string, collectionName: string) {
    const runtimeConfig = useRuntimeConfig()

    const adminApp = ensureAdminApp({
      projectId: runtimeConfig.public.vuefire!.config!.projectId,
      ...runtimeConfig.vuefire?.admin?.options,
    }, 'admin-item-service')
    this.db = getAdminFirestore(adminApp)

    this.colRef = this.db.collection(collectionName) as CollectionReference<Item, WithId<Item>>
  }

  get collection() {
    return this.colRef
  }

  public setUserId = (userId: string) => {
    this.userId = userId
  }

  private toNewItem({ id, ...item }: Item): any {
    return {
      ...item,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: this.userId,
      updatedBy: null
    }
  }

  private toUpdateItem({ id, ...item }: Partial<Item>): any {
    return {
      ...item,
      updatedAt: new Date(),
      updatedBy: this.userId 
    } 
  }

  public withId<T extends QueryDocumentSnapshot<AnyItem, WithId<AnyItem>>>(snapshot: T): WithId<Item> {
    return { ...snapshot.data(), id: snapshot.id } as WithId<Item>
  }

  public async getItem(id: string): Promise<DocumentSnapshot<Item, WithId<Item>> | undefined> {
    const docRef = this.colRef.doc(id)
    return await docRef.get()
  }

  public async getItems(): Promise<QueryDocumentSnapshot<Item, WithId<Item>>[]> {
    const snapshot = await this.colRef.get()
    return snapshot.docs
  }

  public async setItem(id: string, item: Item): Promise<DocumentSnapshot<Item, WithId<Item>>> {
    const itemDoc = this.colRef.doc(id)
    const snapshot = await itemDoc.get()
    const payload = snapshot.exists
      ? {
          ...snapshot.data(),
          ...this.toUpdateItem(item)
        }
      : this.toNewItem(item)

    await itemDoc.set(payload)
    return await itemDoc.get()
  }

  public async addItem(item: Item): Promise<DocumentSnapshot<Item, WithId<Item>>> {
    const newItem = this.toNewItem(item)
    const docRef = await this.colRef.add(newItem)
    return await docRef.get()
  }

  public async updateItem(id: string, item: Partial<Item>): Promise<DocumentSnapshot<Item, WithId<Item>>> {
    const itemDoc = this.colRef.doc(id)
    const updatedItem = this.toUpdateItem(item)
    await itemDoc.set(updatedItem, { merge: true })
    return await itemDoc.get()
  }

  public async deleteItem(id: string): Promise<void> {
    const itemDoc = this.colRef.doc(id)
    await itemDoc.delete()
  }
}
