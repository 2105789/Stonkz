<template>
  <div v-if="projection" class="py-6 relative group">
    <h5 class="font-light text-black/90 text-sm uppercase tracking-wider mb-6">{{ title }}</h5>
    
    <!-- Price range visualization -->
    <div class="mb-8 relative h-16">
      <!-- Visualization area with horizontal grid lines -->
      <div class="absolute inset-0 flex flex-col justify-between">
        <div class="w-full h-px bg-black/5"></div>
        <div class="w-full h-px bg-black/5"></div>
        <div class="w-full h-px bg-black/5"></div>
      </div>
      
      <!-- Price range bar -->
      <div 
        class="absolute h-1 bg-gray-200 rounded-full transform transition-all duration-500"
        :style="`
          left: 8%;
          right: 8%;
          top: 50%;
          margin-top: -0.5px;
        `"
      ></div>
      
      <!-- Lower bound marker -->
      <div 
        class="absolute w-px h-8 bg-black/20 transform transition-all duration-500"
        :style="`
          left: 8%;
          top: 50%;
          margin-top: -16px;
        `"
      >
        <div class="absolute top-full mt-1 left-0 transform -translate-x-1/2 text-xs font-light tracking-wider">
          <span class="whitespace-nowrap text-red-600">₹{{ projection.price_range_lower?.toFixed(2) || '—' }}</span>
        </div>
      </div>
      
      <!-- Upper bound marker -->
      <div 
        class="absolute w-px h-8 bg-black/20 transform transition-all duration-500"
        :style="`
          right: 8%;
          top: 50%;
          margin-top: -16px;
        `"
      >
        <div class="absolute top-full mt-1 right-0 transform translate-x-1/2 text-xs font-light tracking-wider text-right">
          <span class="whitespace-nowrap text-emerald-600">₹{{ projection.price_range_upper?.toFixed(2) || '—' }}</span>
        </div>
      </div>
      
      <!-- Most probable price marker -->
      <div 
        v-if="projection.most_probable_price"
        class="absolute w-2 h-2 rounded-full bg-teal-600 transform transition-all duration-500 -translate-x-1/2"
        :style="`
          left: ${getProbablePosition(projection.price_range_lower, projection.price_range_upper, projection.most_probable_price)}%;
          top: 50%;
          margin-top: -1px;
        `"
      >
        <div class="absolute -bottom-8 left-0 transform -translate-x-1/2 text-[11px] text-teal-600 font-light">
          <span class="uppercase tracking-wider">Probable</span>
          <span class="block mt-0.5">₹{{ projection.most_probable_price?.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Stop loss marker (if available) -->
      <div 
        v-if="projection.stop_loss"
        class="absolute w-2 h-2 rounded-full bg-red-500 transform transition-all duration-500 -translate-x-1/2"
        :style="`
          left: ${getStopLossPosition(projection.price_range_lower, projection.price_range_upper, projection.stop_loss)}%;
          top: 50%;
          margin-top: -1px;
        `"
      >
        <div class="absolute -top-8 left-0 transform -translate-x-1/2 text-[11px] text-red-600 font-light">
          <span class="uppercase tracking-wider">Stop Loss</span>
          <span class="block mt-0.5">₹{{ projection.stop_loss?.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Hover effect line -->
    <div class="absolute bottom-0 left-0 w-full h-px bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
  </div>
  <div v-else class="py-6 relative group">
    <h5 class="font-light text-black/90 text-sm uppercase tracking-wider mb-6">{{ title }}</h5>
    <p class="text-xs sm:text-sm text-black/40 font-extralight uppercase tracking-wide">No data available</p>
    
    <!-- Hover effect line -->
    <div class="absolute bottom-0 left-0 w-full h-px bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  projection: Object // Expects an object like { price_range_lower, price_range_upper, ... }
});

// Helper function to calculate position of the most probable price within range visualization
const getProbablePosition = (lower, upper, probable) => {
  if (!lower || !upper || !probable) return 50;
  
  // Calculate percentage position between lower and upper bound
  const range = upper - lower;
  if (range <= 0) return 50;
  
  const position = ((probable - lower) / range) * 84 + 8;
  return Math.max(8, Math.min(92, position)); // Keep within 8-92% range
};

// Helper function to calculate position of stop loss within range visualization
const getStopLossPosition = (lower, upper, stopLoss) => {
  if (!lower || !upper || !stopLoss) return 8;
  
  // Calculate percentage position
  const range = upper - lower;
  if (range <= 0) return 8;
  
  // Calculate position (can be outside the normal range)
  const position = ((stopLoss - lower) / range) * 84 + 8;
  return Math.max(2, Math.min(98, position)); // Allow slightly outside normal range
};
</script>