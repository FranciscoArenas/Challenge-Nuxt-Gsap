export default defineNuxtConfig({
  // ...existing code...

  build: {
    transpile: ['gsap'],
  },

  modules: [
    // ...existing modules...
  ],

  app: {
    head: {
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/gsap.min.js',
          defer: true
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/CustomEase.min.js',
          defer: true
        }
      ]
    }
  },

  compatibilityDate: '2025-03-01'
})