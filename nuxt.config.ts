// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-04-03',
  extends: ['@nuxt/ui-pro'],
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-vuefire',
  ],
  eslint: {
    config: {
      standalone: false,
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs' 
      }
    }
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,
    },
    config: {
      apiKey: 'AIzaSyBv7FCgp_KvvvGGKT8YRkrJDFx55ze6tKY',
      authDomain: 'placeholder-image.firebaseapp.com',
      projectId: 'placeholder-image',
      storageBucket: 'placeholder-image.appspot.com',
      messagingSenderId: '231868525659',
      appId: '1:231868525659:web:7bb9a89e0eaa61846fa37e',
      measurementId: 'G-0PY1VDWWKF',
    },
  },
  runtimeConfig: {
    leonardoApiKey: '',
    openAi: {
      apiKey: '',
      organisationId: '',
      projectId: ''
    }
  },
})
