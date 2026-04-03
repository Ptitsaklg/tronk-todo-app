export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-05-01',

  devtools: { enabled: false },

  modules: ['@pinia/nuxt'],

  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      import('@tailwindcss/vite').then((m) => m.default()),
    ],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3001/api',
        changeOrigin: true,
      },
    },
  },
});
