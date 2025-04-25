<template>
  <div v-if="projection" class="border border-gray-100 p-3 sm:p-4 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md">
    <h5 class="font-medium text-gray-700 text-sm mb-2 sm:mb-3">{{ title }}</h5>
    <dl class="text-xs sm:text-sm space-y-1 sm:space-y-2">
      <div class="flex justify-between">
        <dt class="text-gray-500">Range:</dt>
        <dd class="font-medium text-indigo-600">
          ₹{{ projection.price_range_lower?.toFixed(2) || 'N/A' }} - ₹{{ projection.price_range_upper?.toFixed(2) || 'N/A' }}
        </dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-gray-500">Probable:</dt>
        <dd class="font-medium text-indigo-700">₹{{ projection.most_probable_price?.toFixed(2) || 'N/A' }}</dd>
      </div>
      <div v-if="projection.stop_loss" class="flex justify-between">
        <dt class="text-gray-500">Stop Loss:</dt>
        <dd class="font-medium text-red-500">₹{{ projection.stop_loss.toFixed(2) }}</dd>
      </div>
    </dl>
  </div>
  <div v-else class="border border-gray-100 p-3 sm:p-4 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md">
    <h5 class="font-medium text-gray-700 text-sm mb-2 sm:mb-3">{{ title }}</h5>
    <p class="text-xs sm:text-sm text-gray-500 italic">No data available.</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  projection: Object // Expects an object like { price_range_lower, price_range_upper, ... }
});

// Helper function directly within component or import globally
// const formatPrice = (price) => price != null ? `₹${price.toFixed(2)}` : 'N/A';
</script>