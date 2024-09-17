// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],

  hooks: {
    close: (nuxt) => {
      if (!nuxt.options._prepare)
        process.exit()
    }
  },

  colorMode: {
    disableTransition: true
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
