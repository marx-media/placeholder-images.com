export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (!authStore.currentUser) {
    await authStore.getMe()
  }
  if (!authStore.currentUser) {
    return navigateTo(`/login?redirect=${encodeURIComponent('/profile')}`)
  }
})
