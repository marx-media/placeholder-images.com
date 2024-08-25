import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  await useAuth().middleware()
})
