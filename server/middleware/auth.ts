import type { UserRecord } from 'firebase-admin/auth'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { ensureAdminApp } from 'vuefire/server'

const AUTH_COOKIE_NAME = '__session'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, AUTH_COOKIE_NAME)
  event.context.user = null

  const runtimeConfig = useRuntimeConfig()

  const adminApp = ensureAdminApp({
    projectId: runtimeConfig.public.vuefire!.config!.projectId,
    ...runtimeConfig.vuefire?.admin?.options,
  }, 'session-verification')
  const adminAuth = getAdminAuth(adminApp)

  try {
    const verifiedSession = token ? await adminAuth.verifySessionCookie(token) : null
    if (verifiedSession) {
      const user = await adminAuth.getUser(verifiedSession.uid)
      event.context.user = user
    }
  } catch (error: any) {
    console.error('[server] Error fetching user for token on auth middleware:', error.message)
  }
})

declare module 'h3' {
  interface H3EventContext {
    user: UserRecord | null
  }
}
