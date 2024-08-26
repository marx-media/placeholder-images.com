import { type Auth, getAuth as _getAuth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import { getFirestore as _getFirestore } from 'firebase/firestore'

let __firestore: Firestore
let __auth: Auth

export const useFirebase = () => {
  const { $firebaseApp } = useNuxtApp()

  const getAuth = () => {
    if (!__auth) {
      __auth = _getAuth($firebaseApp)
    }
    return __auth
  }

  const getFirestore = () => {
    if (!__firestore) {
      __firestore = _getFirestore($firebaseApp)
    }
    return __firestore
  }

  return {
    getFirestore,
    getAuth 
  }
}
