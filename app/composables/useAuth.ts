import { GoogleAuthProvider, OAuthProvider, type UserCredential, createUserWithEmailAndPassword, getAuth, linkWithCredential, linkWithPopup, signInAnonymously, signInWithCredential } from 'firebase/auth'
import { EmailAuthProvider } from 'firebase/auth/web-extension'
import { getFirestore } from 'firebase/firestore'

export const useAuth = () => {
  const { $firebaseApp } = useNuxtApp()
  const db = getFirestore($firebaseApp)
  const auth = getAuth($firebaseApp)

  const userCopy = auth.currentUser!

  const middleware = async () => {
    const user = await getCurrentUser()
    if (!user) {
      try {
        await signInAnonymously(auth)
      } catch (error: any) {
        console.log(error)
      }
    }
  }

  const getFields = (scope: 'signin' | 'signup') => [{
    scope: ['signup'],
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name'
  }, {
    scope: ['signup', 'signin'],
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email'
  }, {
    scope: ['signup', 'signin'],
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password'
  }].filter(field => field.scope.includes(scope))

  const validate = (state: any, scope: 'signin' | 'signup') => {
    const errors = []
    if (['signup'].includes(scope) && !state.name)
      errors.push({ path: 'name', message: 'Name is required' })
    if (['signin', 'signup'].includes(scope) && !state.email)
      errors.push({ path: 'email', message: 'Email is required' })
    if (['signin', 'signup'].includes(scope) && !state.password)
      errors.push({ path: 'password', message: 'Password is required' })
    return errors
  }

  const linkOrSignIn = async (result: Promise<UserCredential>) => {
    try {
      return await result
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        const authCredentials = OAuthProvider.credentialFromError(error)
        if (authCredentials)
          return await signInWithCredential(auth, authCredentials)
      }
      throw error
    }
  }

  const getProviders = () => [
    {
      label: 'Continue with Google',
      icon: 'i-simple-icons-google',
      color: 'gray' as const,
      click: async (): Promise<UserCredential> => {
        const provider = new GoogleAuthProvider()
        return await linkOrSignIn(linkWithPopup(userCopy, provider))
      }
    },
  ]

  const signUpWithEmailAndPassword = async (name: string, email: string, password: string): Promise<UserCredential> => {
    const userCredentils = EmailAuthProvider.credential(email, password)
    return await linkOrSignIn(linkWithCredential(userCopy, userCredentils))
  }

  return {
    validate,
    getProviders,
    getFields,
    middleware,
    signUpWithEmailAndPassword
  }
}
