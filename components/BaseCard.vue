<template>
  <div :class="[$dc('base-card'), 'bg-white border-l-2 border-emerald-300 pl-4 relative transition-all duration-300 hover:pl-5 hover:border-l-emerald-500 rounded-xl overflow-hidden group shadow-sm hover:shadow-md']">
    <div :class="[$dc('card-accent'), 'absolute -left-0 top-0 w-1 h-full bg-gradient-to-b from-emerald-300 to-teal-300 group-hover:from-emerald-500 group-hover:to-teal-500 transition-colors duration-300']"></div>
    
    <div :class="[$dc('card-content'), 'py-5 sm:py-6 px-3 sm:px-4']">
      <h3 v-if="title" :class="[$dc('card-title'), 'relative text-base sm:text-lg font-light tracking-wider text-gray-800 uppercase mb-4 sm:mb-5 pb-3 flex items-center after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-px after:bg-emerald-200']">
        <span :class="[$dc('title-text'), 'relative']">
          {{ title }}
          <span :class="[$dc('title-underline'), 'absolute -bottom-1 left-0 w-full h-px bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full']"></span>
        </span>
      </h3>
      
      <div :class="[$dc('card-body'), 'transform transition-transform duration-300 group-hover:translate-x-0.5']">
        <slot></slot> <!-- Where the card content goes -->
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
});

const { $dc, $did, $da } = useNuxtApp();
</script>