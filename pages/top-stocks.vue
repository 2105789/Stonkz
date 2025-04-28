<template>
  <div class="min-h-screen flex flex-col">
    <NavigationHeader />
    <div class="flex-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 pt-14 px-4 pb-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10 pt-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Top Stock Recommendations</h1>
          <p class="text-gray-600">Find the most confident stock recommendations sorted by confidence score</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex bg-white p-1 rounded-xl shadow-sm">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                activeTab === tab.value 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <!-- Price Range Filter -->
        <div class="max-w-7xl mx-auto mb-8">
          <div class="bg-white p-4 rounded-xl shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-700">Price Range Filter</h3>
              <button 
                @click="clearPriceFilters" 
                class="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': selectedPriceRanges.length === 0 }"
                :disabled="selectedPriceRanges.length === 0"
              >
                Clear Filters
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="range in priceRanges"
                :key="range.id"
                @click="togglePriceRange(range.id)"
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                :class="[
                  selectedPriceRanges.includes(range.id)
                    ? 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ range.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center my-10">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-10 w-10 text-indigo-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-indigo-500">Loading recommendations...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-center">
          <p class="text-red-600">{{ error }}</p>
          <button @click="fetchStocks" class="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition">
            Try Again
          </button>
        </div>

        <!-- Stock Recommendations List -->
        <div v-else>
          <div v-if="filteredStocks.length === 0" class="text-center my-20">
            <p class="text-gray-600">No stock recommendations found for this category.</p>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="stock in paginatedStocks" 
                :key="stock.id" 
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-200"
              >
                <div class="border-b border-gray-100 p-5">
                  <div class="flex items-center justify-between mb-2">
                    <router-link 
                      :to="`/stock/${stock.id}`" 
                      class="text-lg font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {{ stock.name || stock.id }}
                    </router-link>
                    <div 
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-semibold',
                        stock.model_based_signal.recommendation === 'BUY' 
                          ? 'bg-green-100 text-green-800' 
                          : stock.model_based_signal.recommendation === 'SELL'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ stock.model_based_signal.recommendation }}
                    </div>
                  </div>
                  <div class="flex items-center mb-4">
                    <div class="font-semibold text-gray-900 mr-2">Confidence:</div>
                    <div class="flex items-center">
                      <div 
                        class="h-2 w-24 bg-gray-100 rounded-full overflow-hidden"
                      >
                        <div 
                          class="h-full rounded-full"
                          :class="{
                            'bg-green-500': stock.model_based_signal.recommendation === 'BUY',
                            'bg-yellow-500': stock.model_based_signal.recommendation === 'HOLD',
                            'bg-red-500': stock.model_based_signal.recommendation === 'SELL'
                          }"
                          :style="`width: ${stock.model_based_signal.confidence_score}%`"
                        ></div>
                      </div>
                      <span class="ml-2 text-sm font-medium text-gray-700">
                        {{ stock.model_based_signal.confidence_score }}%
                      </span>
                    </div>
                  </div>
                </div>
                <div class="px-5 py-4">
                  <h3 class="text-sm font-medium text-gray-700 mb-2">Supporting Evidence:</h3>
                  <ul class="text-sm text-gray-600 space-y-2">
                    <li 
                      v-for="(evidence, index) in stock.model_based_signal.supporting_evidence.slice(0, 2)" 
                      :key="index"
                      class="flex items-start"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{{ evidence }}</span>
                    </li>
                  </ul>
                  <router-link 
                    :to="`/stock/${stock.id}`" 
                    class="block mt-4 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View full analysis →
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Load More Button -->
            <div v-if="hasMoreStocks" class="flex justify-center mt-8">
              <button 
                @click="loadMoreStocks" 
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Load More
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

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Buy', value: 'BUY' },
  { label: 'Hold', value: 'HOLD' },
  { label: 'Sell', value: 'SELL' }
]

// Price range filter options
const priceRanges = [
  { id: 'range1', label: '₹0-10', min: 0, max: 10 },
  { id: 'range2', label: '₹10-50', min: 10, max: 50 },
  { id: 'range3', label: '₹50-100', min: 50, max: 100 },
  { id: 'range4', label: '₹100-250', min: 100, max: 250 },
  { id: 'range5', label: '₹250-500', min: 250, max: 500 },
  { id: 'range6', label: '₹500-1000', min: 500, max: 1000 },
  { id: 'range7', label: '₹1000-5000', min: 1000, max: 5000 },
  { id: 'range8', label: '₹5000+', min: 5000, max: Infinity }
]

const activeTab = ref('ALL')
const stocks = ref([])
const loading = ref(true)
const error = ref(null)
const itemsPerPage = ref(6)
const currentPage = ref(1)
const selectedPriceRanges = ref([])

// Toggle price range selection
const togglePriceRange = (rangeId) => {
  const index = selectedPriceRanges.value.indexOf(rangeId)
  if (index === -1) {
    selectedPriceRanges.value.push(rangeId)
  } else {
    selectedPriceRanges.value.splice(index, 1)
  }
  // Reset pagination when filters change
  currentPage.value = 1
}

// Clear all price filters
const clearPriceFilters = () => {
  selectedPriceRanges.value = []
  currentPage.value = 1
}

const filteredStocks = computed(() => {
  // First filter by active tab if not ALL
  let filtered = activeTab.value === 'ALL' 
    ? stocks.value 
    : stocks.value.filter(stock => 
        stock.model_based_signal && 
        stock.model_based_signal.recommendation === activeTab.value
      );
  
  // Apply price range filter if any ranges are selected
  if (selectedPriceRanges.value.length > 0) {
    filtered = filtered.filter(stock => {
      // Get the current price from analysis_metadata
      const currentPrice = stock.analysis_metadata?.current_price
      
      // Skip stocks without price information
      if (currentPrice === undefined || currentPrice === null) {
        return false
      }
      
      // Check if the stock's price falls within any of the selected ranges
      return selectedPriceRanges.value.some(rangeId => {
        const range = priceRanges.find(r => r.id === rangeId)
        return range && currentPrice >= range.min && currentPrice <= range.max
      })
    })
  }
  
  // Always ensure sorting by confidence score in descending order
  return filtered.sort((a, b) => 
    b.model_based_signal.confidence_score - a.model_based_signal.confidence_score
  );
})

const paginatedStocks = computed(() => {
  const lastIndex = currentPage.value * itemsPerPage.value;
  return filteredStocks.value.slice(0, lastIndex);
})

const hasMoreStocks = computed(() => {
  return paginatedStocks.value.length < filteredStocks.value.length;
})

const loadMoreStocks = () => {
  currentPage.value++;
}

// Reset pagination when filters change
watch([activeTab, selectedPriceRanges], () => {
  currentPage.value = 1;
})

const fetchStocks = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Build query parameters for price ranges
    let url = '/api/top-stocks'
    
    // Only add price filter parameters if ranges are selected
    if (selectedPriceRanges.value.length > 0) {
      // Find min and max values from all selected ranges
      const selectedRanges = priceRanges.filter(range => 
        selectedPriceRanges.value.includes(range.id)
      )
      
      // We don't send query params for client-side filtering
      // This allows us to keep the filtering logic on the client
      // which gives more flexibility for the UI interactions
    }
    
    // Fetch top stocks from API
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch top stocks')
    }
    
    const data = await response.json()
    
    // Combine all categories into a single array
    // The API now returns { buy: [...], hold: [...], sell: [...] }
    const allStocks = [
      ...(data.buy || []),
      ...(data.hold || []),
      ...(data.sell || [])
    ]
    
    // Store the combined array
    stocks.value = allStocks
  } catch (err) {
    console.error('Error fetching top stocks:', err)
    error.value = 'Failed to load stock recommendations. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStocks)
</script>