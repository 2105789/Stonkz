import { defineNuxtPlugin } from '#app'
import { dynamicClass, dynamicId, dynamicAttr } from '~/utils/dynamicClassNames'

export default defineNuxtPlugin((nuxtApp) => {
  // Return the helpers as provides
  return {
    provide: {
      // Helper for dynamic class names
      dc: dynamicClass,
      
      // Helper for dynamic IDs
      did: dynamicId,
      
      // Helper for dynamic attributes
      da: dynamicAttr
    }
  }
}); 