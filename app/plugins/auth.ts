export default defineNuxtPlugin(async () => {
  await useAuthentication().middleware()
})
