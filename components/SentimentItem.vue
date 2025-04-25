<template>
  <div v-if="sentiment" class="flex justify-between items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
    <span class="font-medium text-xs sm:text-sm text-gray-700">{{ title }}</span>
    <div class="text-right">
      <span :class="outlookClass" class="text-xs sm:text-sm font-medium py-1 px-2 rounded-md bg-opacity-10">
        {{ sentiment.outlook || 'N/A' }}
      </span>
      <span class="ml-1 sm:ml-2 text-xs text-gray-500 block sm:inline-block mt-1 sm:mt-0" v-if="sentiment.confidence_score != null">
        (Score: {{ sentiment.confidence_score }})
      </span>
    </div>
  </div>
  <div v-else class="flex justify-between items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
    <span class="font-medium text-xs sm:text-sm text-gray-700">{{ title }}</span>
    <p class="text-xs text-gray-500 italic">No data available.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  sentiment: Object // Expects an object like { outlook, confidence_score }
});

const outlookClass = computed(() => {
  const outlookLower = props.sentiment?.outlook?.toLowerCase() || 'neutral';
  switch (outlookLower) {
    case 'positive':
    case 'bullish':
      return 'text-green-600 bg-green-50';
    case 'negative':
    case 'bearish':
      return 'text-red-600 bg-red-50';
    case 'neutral':
    default:
      return 'text-yellow-600 bg-yellow-50';
  }
});
</script>