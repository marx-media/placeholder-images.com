import type { CollectionReference, Query, QueryConstraint, WithFieldValue } from 'firebase/firestore'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc } from 'firebase/firestore'
import type { AnyItem, IBase, WithId } from '~~/shared/models/IBase'

export const useItem = <Item extends AnyItem = AnyItem> (collectionName: string) => {
  const { getFirestore, getAuth } = useFirebase()

  const db = getFirestore()
  const auth = getAuth()

  const colRef = collection(db, collectionName) as CollectionReference<Item, IBase<Item>>

  const toNewItem = ({ id, ...rest }: any): IBase<Item> => {
    const ts = new Date()
    return {
      ...rest,
      createdAt: ts,
      updatedAt: null,
      createdBy: auth.currentUser ? doc(db, 'users', auth.currentUser.uid) : null,
      updatedBy: null
    }
  }
  const toUpdateItem = ({ id, ...rest }: any): any => {
    return {
      ...rest,
      updatedAt: new Date(),
      updatedBy: auth.currentUser ? doc(db, 'users', auth.currentUser.uid) : null
    }
  }

  const setItem = async (id: string, item: Item) => {
    const itemDoc = doc(colRef, id)
    const snapshot = await getDoc(itemDoc)
    const payload = snapshot.exists()
      ? {
          ...snapshot.data(),
          ...toUpdateItem(item)
        } 
      : toNewItem(item)

    await setDoc(itemDoc, payload)
    return doc(colRef, id)
  }

  const addItem = async (item: AnyItem) => {
    const newItem = toNewItem(item)
    return await addDoc(colRef, newItem)
  }

  const updateItem = async (id: string, item: AnyItem) => {
    const itemDoc = doc(colRef, id)
    const updateItem = toUpdateItem(item)
    await setDoc(itemDoc, updateItem, { merge: true })
  }

  const deleteItem = async (id: string) => {
    const itemDoc = doc(colRef, id)
    await deleteDoc(itemDoc)
  }

  const queryItems = async (...queries: QueryConstraint[]) => {
    const q = query(colRef, ...queries)
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.ref)
  }

  const queryItem = async (...queries: QueryConstraint[]) => {
    const q = query(colRef, ...queries, limit(1))
    const snapshot = await getDocs(q)
    return snapshot.docs[0]?.ref
  }

  const getItem = async (id: string) => {
    const docRef = doc(colRef, id)
    return await getDoc(docRef)
  }

  return {
    setItem,
    addItem,
    updateItem,
    deleteItem,
    queryItems,
    queryItem,
    getItem
  }
}
