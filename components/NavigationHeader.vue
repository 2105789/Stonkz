<template>
  <div class="fixed inset-y-0 left-0 w-20 z-50 border-r border-gray-100 flex flex-col bg-gradient-to-b from-white to-emerald-50/80 backdrop-blur-lg rounded-r-xl shadow-sm hidden md:flex">
    <div class="h-20 flex items-center justify-center border-b border-emerald-100">
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-1.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>
    
    <div class="flex-1 flex flex-col items-center justify-center space-y-10">
      <router-link to="/" class="text-gray-700 hover:text-emerald-600 transition-colors group" active-class="text-emerald-600">
        <div class="flex flex-col items-center">
          <div class="p-2 rounded-lg group-hover:bg-emerald-50 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span class="mt-1 text-[10px] font-light tracking-wider uppercase">Home</span>
          <div class="h-0.5 w-6 mt-2 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" :class="{ '!scale-x-100': $route.path === '/' }"></div>
        </div>
      </router-link>
      
      <router-link to="/top-stocks" class="text-gray-700 hover:text-emerald-600 transition-colors group" active-class="text-emerald-600">
        <div class="flex flex-col items-center">
          <div class="p-2 rounded-lg group-hover:bg-emerald-50 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span class="mt-1 text-[10px] font-light tracking-wider uppercase">Top</span>
          <div class="h-0.5 w-6 mt-2 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" :class="{ '!scale-x-100': $route.path === '/top-stocks' }"></div>
        </div>
      </router-link>
    </div>
    
    <div class="h-20 flex items-center justify-center border-t border-emerald-100">
      <a href="#" class="text-gray-700 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50 group">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-1.5 rounded-full scale-90 group-hover:scale-100 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
// Navigation header component
</script> 