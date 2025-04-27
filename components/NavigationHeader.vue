<template>
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3 px-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center">
        <div class="bg-indigo-600 rounded-full p-2 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <router-link to="/" class="text-xl font-bold text-gray-800">Stock Analysis</router-link>
      </div>
      <div class="flex items-center space-x-6">
        <router-link to="/" class="text-gray-700 hover:text-indigo-600 transition">Home</router-link>
        <router-link to="/top-stocks" class="text-gray-700 hover:text-indigo-600 transition">Top Stocks</router-link>
      </div>
    </div>
  </div>
  <div class="pt-16">
    <!-- Spacer to prevent content from being hidden under the fixed header -->
  </div>
</template>

<script setup>
// Navigation header component
</script> 