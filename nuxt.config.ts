// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/supabase'
  ],

  colorMode: {
    disableTransition: true
  },

  routeRules: {

  },

  devtools: {
    enabled: false
  },

  typescript: {
    strict: false
  },

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      include: ['/profile(/*)?'],
    },
  },
  compatibilityDate: '2024-07-11'
})
