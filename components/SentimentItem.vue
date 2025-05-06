<template>
  <div v-if="sentiment" class="flex flex-col py-6 border-b border-gray-100 relative overflow-hidden group transition-all duration-500 rounded-lg hover:bg-gray-50/50">
    <div class="flex justify-between items-center mb-3">
      <span class="font-light text-xs sm:text-sm tracking-wide uppercase text-gray-700">{{ title }}</span>
      <span :class="outlookClassText" class="text-xs sm:text-sm font-medium uppercase tracking-wider px-3 py-1 rounded-full">
        {{ sentiment.outlook || 'N/A' }}
      </span>
    </div>
    
    <!-- Sentiment visual bar -->
    <div class="w-full h-2 bg-gray-100 relative rounded-full overflow-hidden">
      <div :class="outlookClassBar" 
           class="absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full shadow-sm"
           :style="`width: ${getSentimentWidth(sentiment.outlook, sentiment.confidence_score)}%`"></div>
    </div>
    
    <!-- Score indicator -->
    <div class="flex justify-end mt-2">
      <span :class="[outlookClassText, 'text-xs font-medium px-2 py-0.5 rounded-md']">{{ sentiment.confidence_score || '—' }}</span>
    </div>
    
    <!-- Hover effect line -->
    <div class="absolute -bottom-px left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
  </div>
  <div v-else class="py-6 border-b border-gray-100 relative overflow-hidden group transition-all duration-500 rounded-lg hover:bg-gray-50/50">
    <div class="flex justify-between items-center">
      <span class="font-light text-xs sm:text-sm tracking-wide uppercase text-gray-700">{{ title }}</span>
      <p class="text-xs text-gray-400 font-light uppercase tracking-wider px-3 py-1 bg-gray-50 rounded-full">Unavailable</p>
    </div>
    
    <!-- Empty state visual bar -->
    <div class="w-full h-2 bg-gray-100 mt-3 rounded-full"></div>
    
    <!-- Hover effect line -->
    <div class="absolute -bottom-px left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  sentiment: Object // Expects an object like { outlook, confidence_score }
});

const outlookClassText = computed(() => {
  const outlookLower = props.sentiment?.outlook?.toLowerCase() || 'neutral';
  switch (outlookLower) {
    case 'positive':
    case 'bullish':
      return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    case 'negative':
    case 'bearish':
      return 'text-red-700 bg-red-50 border border-red-200';
    case 'neutral':
    default:
      return 'text-amber-700 bg-amber-50 border border-amber-200';
  }
});

const outlookClassBar = computed(() => {
  const outlookLower = props.sentiment?.outlook?.toLowerCase() || 'neutral';
  switch (outlookLower) {
    case 'positive':
    case 'bullish':
      return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    case 'negative':
    case 'bearish':
      return 'bg-gradient-to-r from-red-400 to-red-500';
    case 'neutral':
    default:
      return 'bg-gradient-to-r from-amber-300 to-amber-400';
  }
});

// Helper function to calculate width for sentiment bar
const getSentimentWidth = (outlook, score) => {
  if (!score) return 0;
  
  // Base the width on the confidence score (0-100)
  let width = score;
  
  // For negative/bearish sentiment, flip the display (higher confidence = more filled)
  const outlookLower = outlook?.toLowerCase() || '';
  if (outlookLower.includes('positive') || outlookLower.includes('bullish')) {
    return width;
  } else if (outlookLower.includes('negative') || outlookLower.includes('bearish')) {
    return width;
  }
  
  // For neutral, cap at 50%
  return Math.min(width, 50);
};
</script>