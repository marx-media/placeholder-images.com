export default defineEventHandler((event) => {
  console.log('USER', event.context.user)
  return {
    user: event.context.user ?? null
  }
})
