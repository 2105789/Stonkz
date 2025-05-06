<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <NavigationHeader />
    <MobileNavigation />
    
    <div class="flex-1 flex flex-col lg:flex-row md:ml-20 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20">
      <!-- Main content centered in page -->
      <div class="w-full h-full flex items-center justify-center px-4 sm:px-8">
        <div class="max-w-3xl mx-auto">
          <!-- Logo and title -->
          <div class="mb-6 md:mb-10 flex items-center justify-center lg:justify-start">
            <div class="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 class="ml-3 md:ml-4 text-3xl md:text-4xl lg:text-6xl font-light tracking-tight text-gray-900">
              <span class="block relative">
                ST<span class="text-emerald-600">O</span>NKZ<span class="absolute top-0 -right-3 w-2 h-2 bg-emerald-600 rounded-full"></span>
              </span>
            </h1>
          </div>
          
          <!-- Tagline -->
          <div class="text-center lg:text-left mb-8 md:mb-12">
            <h2 class="text-xl md:text-2xl lg:text-4xl font-light tracking-wider text-gray-800 mb-4 md:mb-6">
              Financial <span class="text-emerald-600">intelligence</span> reimagined
            </h2>
            
            <p class="text-gray-600 font-light tracking-wide leading-relaxed text-sm md:text-base">
              Advanced market analysis and stock projections with unmatched precision and clarity
            </p>
          </div>
          
          <!-- Search box -->
          <div class="relative mb-8 md:mb-12">
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
                class="w-full border-0 border-b-2 border-emerald-200 pl-10 pr-6 md:pl-12 md:pr-12 py-4 md:py-5 focus:outline-none focus:border-emerald-500 bg-white/80 font-light text-base md:text-lg placeholder:text-gray-400 placeholder:font-light rounded-xl shadow-sm"
              />
              <div class="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div v-if="loading" class="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                <svg class="animate-spin h-4 w-4 md:h-5 md:w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              </div>
            </div>
            
            <ul v-if="showDropdown && filtered.length" class="absolute z-10 left-0 right-0 bg-white border border-emerald-100 shadow-lg rounded-xl max-h-64 overflow-y-auto transition-all duration-300">
              <li
                v-for="(item, i) in filtered"
                :key="item.id"
                :class="[activeIndex === i ? 'bg-emerald-50' : '', 'px-4 md:px-5 py-3 md:py-4 cursor-pointer hover:bg-emerald-50 transition flex items-center justify-between font-light border-b border-emerald-50 last:border-b-0']"
                @mouseenter="prefetch(item.id, i)"
                @mouseleave="clearPrefetch()"
                @mousedown="select(i, $event)"
              >
                <div class="flex items-center">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  <span class="text-sm md:text-base">{{ item.name || item.id }}</span>
                </div>
                <div v-if="activeIndex === i" class="text-emerald-600 flex items-center">
                  <span class="text-xs uppercase tracking-wider mr-2">View</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pb-16 md:pb-0">
            <router-link to="/top-stocks" class="group w-full sm:w-auto">
              <div class="flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <span class="text-xs md:text-sm font-medium uppercase tracking-wider mr-3">Top Recommendations</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </router-link>
          </div>
          
          <!-- Loading indicator - changed to fixed positioning to prevent pushing content -->
          <div v-if="navigating" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div class="flex flex-col items-center bg-white/80 backdrop-blur-sm py-4 px-6 rounded-lg shadow-lg">
              <svg class="animate-spin h-6 w-6 md:h-8 md:w-8 text-emerald-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <span class="text-emerald-600 font-light uppercase tracking-wider text-xs">Loading</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavigationHeader from '../components/NavigationHeader.vue'
import MobileNavigation from '../components/MobileNavigation.vue'

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

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('input') && !e.target.closest('ul')) {
      showDropdown.value = false
    }
  })
})

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
  try {
    const res = await fetch('/api/stock-list')
    list.value = await res.json()
    filtered.value = list.value
  } catch (err) {
    console.error('Failed to fetch stock list:', err)
  } finally {
    loading.value = false
    prefetchTopFiltered()
  }
}

const filterList = () => {
  const q = query.value.toLowerCase()
  filtered.value = list.value.filter(item => (item.name || item.id).toLowerCase().includes(q))
  activeIndex.value = filtered.value.length > 0 ? 0 : -1
  nextTick(() => {
    const ul = document.querySelector('ul')
    if (ul) ul.scrollTop = 0
  })
}

const move = (dir) => {
  if (!filtered.value.length) return
  activeIndex.value = (activeIndex.value + dir + filtered.value.length) % filtered.value.length
  
  // Ensure active item is visible in the scrollable list
  nextTick(() => {
    const activeItem = document.querySelector(`li:nth-child(${activeIndex.value + 1})`)
    const ul = document.querySelector('ul')
    if (activeItem && ul) {
      const itemTop = activeItem.offsetTop
      const itemBottom = itemTop + activeItem.offsetHeight
      const ulTop = ul.scrollTop
      const ulBottom = ulTop + ul.offsetHeight
      
      if (itemBottom > ulBottom) {
        ul.scrollTop = itemBottom - ul.offsetHeight
      } else if (itemTop < ulTop) {
        ul.scrollTop = itemTop
      }
    }
  })
}

const select = (index, event) => {
  if (index === -1 || !filtered.value[index]) return
  navigating.value = true
  
  // Prefetch to ensure fast navigation
  prefetch(filtered.value[index].id, index, true)
}

const prefetchTopFiltered = () => {
  if (filtered.value.length > 0) {
    prefetch(filtered.value[0].id, 0)
  }
}

const prefetch = async (id, index, navigate = false) => {
  if (prefetchTimeout) clearTimeout(prefetchTimeout)
  
  // Only prefetch after a short delay to avoid unnecessary requests
  prefetchTimeout = setTimeout(async () => {
    // Check cache
    if (!prefetchCache[id]) {
      try {
        // Fetch data from API
        const res = await fetch(`/api/stock/${id}`)
        prefetchCache[id] = await res.json()
      } catch (err) {
        console.error('Failed to prefetch stock:', err)
      }
    }
    
    // Navigate if requested - FIXED: Changed to use router.push correctly
    if (navigate) {
      // Only navigate to the frontend route, not the API endpoint
      router.push(`/stock/${id}`)
    }
  }, navigate ? 0 : 100)
}

const clearPrefetch = () => {
  if (prefetchTimeout) clearTimeout(prefetchTimeout)
}

// Fetch the list on component mount
onMounted(() => {
  fetchList()
})
</script>

<style>
body { 
  background: #ffffff; 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

input, ul { 
  transition: all 0.3s ease;
}
</style>
