<template>
  <div class="min-h-screen flex flex-col">
    <NavigationHeader />
    <MobileNavigation />
    <div class="flex-1 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 pt-0 md:ml-20">
    
      <!-- Header area with angled design -->
      <div class="relative h-36 sm:h-48 mb-6 sm:mb-8 overflow-hidden">
        <div class="absolute inset-0 bg-emerald-500/10 transform -skew-y-3 origin-bottom-left"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center px-4">
            <h1 class="text-2xl sm:text-3xl font-extralight tracking-wider text-gray-900 relative inline-block">
              <span class="relative">Top Recommendations</span>
              <span class="absolute -right-6 -top-2 w-2 h-2 bg-emerald-600"></span>
            </h1>
            <p class="text-gray-700 font-light tracking-wide mt-2 text-sm sm:text-base">Highest confidence analysis by intelligent models</p>
          </div>
        </div>
      </div>
      
      <div class="px-4 sm:px-6 lg:px-12 pb-20 md:pb-8">
        <!-- Filter Controls -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center max-w-7xl mx-auto mb-6 sm:mb-10">
          <!-- Filter Tabs -->
          <div class="flex mb-6 md:mb-0 overflow-x-auto pb-2 w-full md:w-auto">
            <div class="flex border-b border-emerald-200 mr-6">
              <button 
                v-for="tab in tabs" 
                :key="tab.value"
                @click="activeTab = tab.value"
                :class="[
                  'relative px-3 sm:px-5 py-2 font-light text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 mr-4 sm:mr-6 last:mr-0 whitespace-nowrap',
                  activeTab === tab.value 
                    ? 'text-emerald-700' 
                    : 'text-gray-400 hover:text-emerald-600'
                ]"
              >
                {{ tab.label }}
                <span 
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 transition-transform duration-300" 
                  :class="{ '!scale-x-100': activeTab === tab.value }"
                ></span>
              </button>
            </div>
          </div>
          
          <!-- Price Range Filter Toggle -->
          <div class="relative">
            <button 
              @click="showPriceFilter = !showPriceFilter" 
              class="flex items-center text-xs sm:text-sm font-light tracking-wider transition-colors py-2"
              :class="selectedPriceRanges.length > 0 ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'"
            >
              <span class="uppercase">Filter</span>
              <span v-if="selectedPriceRanges.length > 0" class="mx-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                {{ selectedPriceRanges.length }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 ml-2" :class="{ 'rotate-180': showPriceFilter }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Price Range Filter Panel -->
        <div 
          v-if="showPriceFilter" 
          class="max-w-7xl mx-auto mb-6 sm:mb-8 transform transition-all duration-300 border-b border-emerald-100 pb-6"
          :class="showPriceFilter ? 'opacity-100' : 'opacity-0 -translate-y-4 pointer-events-none'"
        >
          <div class="flex flex-wrap items-center">
            <h3 class="text-xs sm:text-sm font-light uppercase tracking-wider text-gray-800 mr-6 mb-4">Price Range</h3>
            <div class="flex flex-wrap gap-2 sm:gap-3">
              <button
                v-for="range in priceRanges"
                :key="range.id"
                @click="togglePriceRange(range.id)"
                class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-light tracking-wider transition-all duration-300 rounded-lg"
                :class="[
                  selectedPriceRanges.includes(range.id)
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'bg-white text-gray-700 border border-emerald-200 hover:border-emerald-300'
                ]"
              >
                {{ range.label }}
              </button>
              
              <button 
                @click="clearPriceFilters" 
                class="text-xs text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-wider font-light px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent"
                :class="{ 'opacity-50 cursor-not-allowed': selectedPriceRanges.length === 0 }"
                :disabled="selectedPriceRanges.length === 0"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center my-12 sm:my-16">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-emerald-600 mb-3 sm:mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-emerald-600 font-light uppercase tracking-wider text-xs">Loading</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-xl mx-auto border-l-2 border-emerald-300 p-4 sm:p-6 rounded-lg text-center">
          <p class="text-gray-700 mb-4 text-sm sm:text-base">{{ error }}</p>
          <button @click="fetchStocks" class="px-4 sm:px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-md transition-all duration-300 text-xs tracking-wider uppercase font-light">
            Try Again
          </button>
        </div>

        <!-- Stock Recommendations List -->
        <div v-else class="max-w-7xl mx-auto">
          <div v-if="filteredStocks.length === 0" class="text-center my-12 sm:my-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 font-light tracking-wide text-sm sm:text-base mb-2">No stock recommendations found for the selected filters.</p>
            <div v-if="selectedPriceRanges.length > 0" class="mt-4">
              <button 
                @click="clearPriceFilters" 
                class="text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors duration-300 px-4 py-2 rounded-lg uppercase tracking-wider font-light"
              >
                Clear Price Filters
              </button>
            </div>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              <div 
                v-for="stock in paginatedStocks" 
                :key="stock.id" 
                class="relative group transition duration-500"
              >
                <div class="absolute -inset-x-2 -inset-y-2 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300 rounded-lg pointer-events-none"></div>
                
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                  <router-link 
                    :to="`/stock/${stock.id}`" 
                    class="text-base sm:text-xl font-light tracking-wide text-gray-800 hover:text-emerald-600 transition-all duration-300"
                  >
                    {{ stock.name || stock.id }}
                  </router-link>
                  <div 
                    :class="[
                      'relative px-2 sm:px-3 py-1 text-xs font-light tracking-wider uppercase transition-all duration-300 rounded-full',
                      stock.model_based_signal.recommendation === 'BUY' 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                        : stock.model_based_signal.recommendation === 'SELL'
                          ? 'text-red-700 bg-red-50 border border-red-200'
                          : 'text-amber-700 bg-amber-50 border border-amber-200'
                    ]"
                  >
                    {{ stock.model_based_signal.recommendation }}
                    <span 
                      class="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      :class="[
                        stock.model_based_signal.recommendation === 'BUY' 
                          ? 'bg-emerald-500' 
                          : stock.model_based_signal.recommendation === 'SELL'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                      ]"
                    ></span>
                  </div>
                </div>
                
                <!-- Stock price display -->
                <div class="flex items-center mt-2 sm:mt-3">
                  <span class="text-xs font-light text-gray-500 uppercase mr-2">Price:</span>
                  <span class="text-sm font-light text-gray-800">
                    ₹{{ 
                      stock.price_projections?.current_price_data?.current_price?.toFixed(2) || 
                      stock.analysis_metadata?.current_price?.toFixed(2) || 
                      stock.price?.toFixed(2) || 
                      '—'
                    }}
                  </span>
                </div>
                
                <!-- Confidence indicator -->
                <div class="mb-5 sm:mb-6">
                  <div class="flex items-center justify-between mb-1">
                    <div class="font-light text-gray-700 text-xs uppercase tracking-wider">Confidence</div>
                    <div class="text-xs font-light text-gray-600">
                      {{ stock.model_based_signal.confidence_score }}%
                    </div>
                  </div>
                  <div class="h-0.5 w-full bg-gray-100 rounded-full">
                    <div 
                      class="h-full transition-all duration-700 ease-out rounded-full"
                      :class="{
                        'bg-emerald-500': stock.model_based_signal.recommendation === 'BUY',
                        'bg-amber-500': stock.model_based_signal.recommendation === 'HOLD',
                        'bg-red-500': stock.model_based_signal.recommendation === 'SELL'
                      }"
                      :style="`width: ${stock.model_based_signal.confidence_score}%`"
                    ></div>
                  </div>
                </div>
                
                <!-- Evidence section -->
                <div class="mt-5 sm:mt-6 border-t border-emerald-100 pt-3 sm:pt-4">
                  <h3 class="text-xs font-light tracking-wider uppercase text-gray-700 mb-2 sm:mb-3">Evidence</h3>
                  <ul class="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-3 font-light">
                    <li 
                      v-for="(evidence, index) in stock.model_based_signal.supporting_evidence.slice(0, 2)" 
                      :key="index"
                      class="flex items-start"
                    >
                      <span class="mr-2 text-emerald-400 font-light">—</span>
                      <span>{{ evidence }}</span>
                    </li>
                  </ul>
                  
                  <router-link 
                    :to="`/stock/${stock.id}`" 
                    class="group inline-flex items-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 hover:text-emerald-600 transition-all duration-300"
                  >
                    <span class="uppercase tracking-wider text-xs font-light">Full Analysis</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Pagination controls -->
            <div class="flex justify-center items-center mt-8 sm:mt-12">
              <button 
                @click="previousPage" 
                :disabled="currentPage === 1" 
                :class="[
                  'p-2 rounded-lg mr-2 transition-colors duration-300',
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div class="flex items-center">
                <span class="text-sm font-light text-gray-600 mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
              </div>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                :class="[
                  'p-2 rounded-lg ml-2 transition-colors duration-300',
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavigationHeader from '../components/NavigationHeader.vue'
import MobileNavigation from '../components/MobileNavigation.vue'

// State
const stocks = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('all')
const showPriceFilter = ref(false)
const selectedPriceRanges = ref([])
const currentPage = ref(1)
const itemsPerPage = 9

// Filter options
const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'BUY' },
  { label: 'Sell', value: 'SELL' },
  { label: 'Hold', value: 'HOLD' }
]

const priceRanges = [
  { id: 'very_low', label: '₹0 - ₹50' },
  { id: 'low', label: '₹50 - ₹100' },
  { id: 'low_medium', label: '₹100 - ₹250' },
  { id: 'medium', label: '₹250 - ₹500' },
  { id: 'medium_high', label: '₹500 - ₹1000' },
  { id: 'high', label: '₹1000 - ₹2000' },
  { id: 'very_high', label: '₹2000+' }
]

// Filtered stocks based on active tab and selected price ranges
const filteredStocks = computed(() => {
  let filtered = [...stocks.value]
  
  // Filter by recommendation type
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(stock => 
      stock.model_based_signal?.recommendation === activeTab.value
    )
  }
  
  // Filter by price range if any selected
  if (selectedPriceRanges.value.length > 0) {
    filtered = filtered.filter(stock => {
      // Get current price from price_projections data structure
      const price = stock.price_projections?.current_price_data?.current_price || stock.analysis_metadata?.current_price || stock.price || 0
      
      return selectedPriceRanges.value.some(range => {
        if (range === 'very_low') return price >= 0 && price <= 50
        if (range === 'low') return price > 50 && price <= 100
        if (range === 'low_medium') return price > 100 && price <= 250
        if (range === 'medium') return price > 250 && price <= 500
        if (range === 'medium_high') return price > 500 && price <= 1000
        if (range === 'high') return price > 1000 && price <= 2000
        if (range === 'very_high') return price > 2000
        return false
      })
    })
  }
  
  // Sort by confidence score (highest to lowest)
  filtered.sort((a, b) => {
    const scoreA = a.model_based_signal?.confidence_score || 0
    const scoreB = b.model_based_signal?.confidence_score || 0
    return scoreB - scoreA // Descending order
  })
  
  return filtered
})

// Calculate total pages for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredStocks.value.length / itemsPerPage)
})

// Get paginated stocks for current page
const paginatedStocks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filteredStocks.value.slice(startIndex, startIndex + itemsPerPage)
})

// Reset to page 1 when filters change
watch([activeTab, selectedPriceRanges], () => {
  currentPage.value = 1
})

// Fetch stocks data from API
const fetchStocks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/top-stocks')
    const data = await response.json()
    
    // Combine all categories into a single array
    const allStocks = [
      ...(data.buy || []),
      ...(data.hold || []),
      ...(data.sell || [])
    ]
    
    // Use actual price data from the stock data
    stocks.value = allStocks.map(stock => {
      // Extract the current price from price_projections if available
      const currentPrice = stock.price_projections?.current_price_data?.current_price || 
                           stock.analysis_metadata?.current_price
      
      return {
        ...stock,
        // Keep original price if available, otherwise use currentPrice, or fallback to a random price only for demo
        price: stock.price || currentPrice || Math.floor(Math.random() * 4000) + 100
      }
    })
    
    // Sort stocks by confidence score after fetching
    stocks.value.sort((a, b) => {
      const scoreA = a.model_based_signal?.confidence_score || 0
      const scoreB = b.model_based_signal?.confidence_score || 0
      return scoreB - scoreA // Descending order
    })
  } catch (err) {
    console.error('Failed to fetch stocks:', err)
    error.value = 'Failed to load recommendations. Please try again.'
  } finally {
    loading.value = false
  }
}

// Toggle price range filter
const togglePriceRange = (rangeId) => {
  const index = selectedPriceRanges.value.indexOf(rangeId)
  if (index === -1) {
    selectedPriceRanges.value.push(rangeId)
  } else {
    selectedPriceRanges.value.splice(index, 1)
  }
}

// Clear price range filters
const clearPriceFilters = () => {
  selectedPriceRanges.value = []
}

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Fetch data on component mount
onMounted(() => {
  fetchStocks()
})
</script>