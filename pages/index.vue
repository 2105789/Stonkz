<template>
  <div>
    <NavigationHeader />
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 py-12 px-4">
      <div class="mb-8 flex items-center">
        <div class="flex items-center">
          <div class="bg-indigo-600 rounded-full p-2 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Stock Analysis</h1>
        </div>
      </div>
      
      <div class="w-full max-w-lg mx-auto text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Find Your Stock Insights</h2>
        <p class="text-gray-600 mb-8">Search for stocks to view detailed analysis and projections</p>
        
        <div class="relative">
          <input
            v-model="query"
            @focus="showDropdown = true"
            @input="onInput"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="select(activeIndex)"
            type="text"
            autocomplete="off"
            placeholder="Search stocks..."
            class="w-full border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
          />
          <div v-if="loading" class="absolute right-5 top-4">
            <svg class="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </div>
          <ul v-if="showDropdown && filtered.length" class="absolute z-10 left-0 right-0 bg-white border border-gray-100 mt-1 rounded-xl shadow-md max-h-60 overflow-y-auto transition-all duration-200">
            <li
              v-for="(item, i) in filtered"
              :key="item.id"
              :class="[activeIndex === i ? 'bg-indigo-50' : '', 'px-5 py-3 cursor-pointer hover:bg-indigo-50 transition flex items-center justify-between']"
              @mouseenter="prefetch(item.id, i)"
              @mouseleave="clearPrefetch()"
              @mousedown="select(i, $event)"
            >
              <span>{{ item.name || item.id }}</span>
              <span v-if="activeIndex === i" class="text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="navigating" class="mt-6 flex justify-center">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-8 w-8 text-indigo-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            <span class="text-indigo-500">Loading document...</span>
          </div>
        </div>
      </div>
      
      <div class="text-center text-sm text-gray-500 mt-8">
        Get detailed analysis and projections for your investment decisions
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavigationHeader from '../components/NavigationHeader.vue'

const query = ref('')
const showDropdown = ref(false)
const list = ref([])
const filtered = ref([])
const activeIndex = ref(-1)
const loading = ref(false)
const navigating = ref(false)
const router = useRouter()
let prefetchCache = {}
let prefetchTimeout = null

// Debounce input for ultra-fast filtering
let debounceTimeout = null
const onInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    filterList()
    prefetchTopFiltered()
  }, 40)
}

const fetchList = async () => {
  loading.value = true
  const res = await fetch('/api/stock-list')
  list.value = await res.json()
  filtered.value = list.value
  loading.value = false
  prefetchTopFiltered()
}

const filterList = () => {
  const q = query.value.toLowerCase()
  filtered.value = list.value.filter(item => (item.name || item.id).toLowerCase().includes(q))
  activeIndex.value = 0
  nextTick(() => {
    const ul = document.querySelector('ul')
    if (ul) ul.scrollTop = 0
  })
}

const move = (dir) => {
  if (!filtered.value.length) return
  activeIndex.value = (activeIndex.value + dir + filtered.value.length) % filtered.value.length
}

const select = async (i, event) => {
  if (!filtered.value[i]) return
  navigating.value = true
  showDropdown.value = false
  if (!prefetchCache[filtered.value[i].id]) {
    await prefetch(filtered.value[i].id, i)
  }
  router.push(`/stock/${filtered.value[i].id}`)
}

const prefetch = async (id, i) => {
  if (prefetchCache[id]) return
  try {
    const res = await fetch(`/api/stock-detail?id=${id}`)
    prefetchCache[id] = await res.json()
  } catch {}
}

const prefetchTopFiltered = () => {
  filtered.value.slice(0, 5).forEach((item, i) => prefetch(item.id, i))
}

const clearPrefetch = () => {
  if (prefetchTimeout) {
    clearTimeout(prefetchTimeout)
    prefetchTimeout = null
  }
}

onMounted(fetchList)
</script>

<style>
body { 
  background: #f5f7fe; 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
input, ul { 
  transition: all 0.2s ease;
}
</style>
