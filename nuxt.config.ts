import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'static'
  },
  vite: {
    optimizeDeps: {
      include: ['three']
    }
  },
  compatibilityDate: '2025-10-19'
})
