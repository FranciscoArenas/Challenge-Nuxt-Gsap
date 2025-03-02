import { defineNuxtPlugin } from '#app'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Registrar plugins de GSAP
    if (CustomEase) {
      gsap.registerPlugin(CustomEase);
      console.log('CustomEase registrado correctamente.');
    } else {
      console.error('CustomEase no está disponible.');
    }
    
    // Crear eases personalizados después de registrar el plugin
    try {
      if (CustomEase) {
        CustomEase.create("hop", "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1");
        CustomEase.create("slideEase", "0.6, 0.01, 0.05, 0.95");
        CustomEase.create("revealEase", "0.33, 0, 0.67, 1");
        CustomEase.create("clipEase", "0.76, 0, 0.24, 1");
        console.log('Custom eases creados correctamente.');
      } else {
        console.error('CustomEase no está disponible, no se pueden crear eases.');
      }
    } catch (error) {
      console.error('Error al registrar CustomEase:', error);
    }

    // Proporcionar las instancias a través del plugin
    nuxtApp.provide('gsap', gsap);
    nuxtApp.provide('CustomEase', CustomEase);
  }
});