<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div class="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
      <div class="flex items-center">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-1.5 mr-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <router-link to="/" class="text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          Stonkz
        </router-link>
      </div>
      <nav>
        <ul class="flex items-center space-x-6">
          <li>
            <router-link to="/" class="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium" active-class="text-indigo-600 font-semibold">
              Home
            </router-link>
          </li>
          <li>
            <router-link to="/top-stocks" class="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium" active-class="text-indigo-600 font-semibold">
              Top Stocks
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Navigation header component
</script> 