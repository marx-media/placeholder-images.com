import { Md5 } from 'ts-md5'
import { EmailAuthProvider, GoogleAuthProvider, OAuthProvider, type User, type UserCredential, linkWithCredential, linkWithPopup, signInAnonymously, signInWithCredential, signOut, updateProfile } from 'firebase/auth'
import type { IUser } from '~~/shared/models'

export const useAuthentication = () => {
  const { getAuth } = useFirebase()
  const { setItem } = useItem<IUser>('users')
  const auth = getAuth()
  const toast = useToast()

  const currentUser = auth.currentUser!

  const middleware = async () => {
    console.debug('Auth middleware')
    const user = auth.currentUser
    if (!user) {
      try {
        await signInAnonymously(auth)
      } catch (error: any) {
        console.log(error)
      }
    }
  }

  const upsertUser = async (user: User) => {
    if (user.isAnonymous)
      return

    const providerData = user.providerData[0]
    const photoURL = providerData && providerData.photoURL
      ? providerData.photoURL
      : providerData && providerData.email
        ? `https://www.gravatar.com/avatar/${Md5.hashStr(providerData.email)}?d=identicon`
        : null

    await setItem(user.uid, { lastSeenAt: new Date(), photoURL })
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

  const linkOrSignIn = async (result: Promise<UserCredential>): Promise<UserCredential> => {
    let _error: any
    let credential: UserCredential | null = null
    try {
      credential = await result
      // await upsertUser(r.user)
    } catch (error: any) {
      if (error.code === 'auth/credential-already-in-use') {
        const anonymousUid = currentUser.isAnonymous ? currentUser.uid : null
        const authCredentials = OAuthProvider.credentialFromError(error)
        if (authCredentials) {
          // HERE WE HAVE TO CHANGE ALL THE REFERENCES TO THE USER
          credential = await signInWithCredential(auth, authCredentials)
        }
      } else {
        _error = error
      }
    }

    if (_error || !credential) {
      console.error(_error)
      toast.add({
        description: _error.message.replace('Firebase: ', '')
      })
      throw _error
    }

    await upsertUser(credential.user)
    return credential
  }

  const getProviders = () => [
    {
      label: 'Continue with Google',
      icon: 'i-simple-icons-google',
      color: 'gray' as const,
      click: async (): Promise<UserCredential> => {
        const provider = new GoogleAuthProvider()
        return await linkOrSignIn(linkWithPopup(currentUser, provider))
      }
    },
  ]

  const signUpWithEmailAndPassword = async (name: string, email: string, password: string): Promise<UserCredential> => {
    const emailAuthCredential = EmailAuthProvider.credential(email, password)

    const userCredentials = await linkOrSignIn(linkWithCredential(currentUser, emailAuthCredential))
    await updateProfile(userCredentials.user, { displayName: name })
    return userCredentials
  }

  const logOut = async () => {
    if (!currentUser.isAnonymous) {
      await signOut(auth)
      return await signInAnonymously(auth)
    }
  }

  return {
    validate,
    getProviders,
    getFields,
    middleware,
    signUpWithEmailAndPassword,
    logOut
  }
}
