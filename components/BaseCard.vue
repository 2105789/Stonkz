<template>
  <div class="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
    <h3 v-if="title" class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b border-gray-100">
      {{ title }}
    </h3>
    <slot></slot> <!-- Where the card content goes -->
  </div>
</template>

<script setup>
defineProps({
  title: String
});
</script>