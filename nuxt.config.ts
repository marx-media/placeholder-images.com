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
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt'
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
    redirect: false
  },
  compatibilityDate: '2024-07-11',
  runtimeConfig: {
    leonardoApiKey: '',
    openAi: {
      apiKey: '',
      organisationId: '',
      projectId: ''
    },
    public: {
      siteUrl: 'http://localhost:3000'
    }
  },
  vite: {
    optimizeDeps: {
      include: ['lodash-es']
    }
  }
})
