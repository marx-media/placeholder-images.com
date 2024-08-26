export default defineNuxtPlugin(() => {
  console.log('api-plugin')
  const cookies = useRequestHeader('cookie')

  const api = $fetch.create({
    credentials: 'include',
    onRequest({ options }) {
      if (cookies) {
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Cookie', cookies])
        } else if (headers instanceof Headers) {
          headers.set('Cookie', cookies)
        } else {
          headers.Cookie = cookies
        }
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})
