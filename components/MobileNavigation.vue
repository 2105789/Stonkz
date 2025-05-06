<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden z-50 rounded-t-xl">
    <div class="flex justify-around items-center py-2">
      <router-link to="/" class="flex flex-col items-center text-gray-700 hover:text-emerald-600 transition-colors group" active-class="text-emerald-600">
        <div class="p-1 rounded-lg group-hover:bg-emerald-50 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span class="mt-0.5 text-[9px] font-light tracking-wider uppercase">Home</span>
        <div class="h-0.5 w-5 mt-1 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" :class="{ '!scale-x-100': $route.path === '/' }"></div>
      </router-link>
      
      <router-link to="/top-stocks" class="flex flex-col items-center text-gray-700 hover:text-emerald-600 transition-colors group" active-class="text-emerald-600">
        <div class="p-1 rounded-lg group-hover:bg-emerald-50 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span class="mt-0.5 text-[9px] font-light tracking-wider uppercase">Top</span>
        <div class="h-0.5 w-5 mt-1 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" :class="{ '!scale-x-100': $route.path === '/top-stocks' }"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Mobile navigation component for bottom navigation
</script> 