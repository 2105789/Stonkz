<template>
  <div class="min-h-screen flex flex-col">
    <NavigationHeader />
    <MobileNavigation />
    <div class="flex-1 bg-gradient-to-br from-white via-gray-50/30 to-gray-50/20 pt-0 md:ml-20">
      <!-- Header area -->
      <div class="relative h-24 sm:h-32 mb-6 overflow-hidden bg-gray-800">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center px-4">
            <h1 class="text-xl sm:text-2xl font-light tracking-wider text-white relative inline-block">
              Admin View - All Stocks
            </h1>
          </div>
        </div>
      </div>
      
      <div class="px-4 sm:px-6 lg:px-12 pb-20 md:pb-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center my-12 sm:my-16">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-gray-600 mb-3 sm:mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-gray-600 font-light uppercase tracking-wider text-xs">Loading All Stocks</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-xl mx-auto border-l-2 border-red-300 p-4 sm:p-6 rounded-lg text-center">
          <p class="text-gray-700 mb-4 text-sm sm:text-base">{{ error }}</p>
          <button @click="fetchAllStocks" class="px-4 sm:px-5 py-2 bg-gray-700 text-white rounded-lg hover:shadow-md transition-all duration-300 text-xs tracking-wider uppercase font-light">
            Try Again
          </button>
        </div>

        <!-- Stats Summary -->
        <div v-else class="mb-8 max-w-7xl mx-auto">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h2 class="text-lg font-light text-gray-800 mb-4">Database Summary</h2>
            
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 font-light uppercase tracking-wider">Total Stocks</div>
                <div class="text-2xl font-light text-gray-800 mt-1">{{ stats.total }}</div>
              </div>
              
              <div class="bg-emerald-50 p-4 rounded-lg">
                <div class="text-sm text-emerald-600 font-light uppercase tracking-wider">Buy</div>
                <div class="text-2xl font-light text-emerald-700 mt-1">{{ stats.buy }}</div>
              </div>
              
              <div class="bg-amber-50 p-4 rounded-lg">
                <div class="text-sm text-amber-600 font-light uppercase tracking-wider">Hold</div>
                <div class="text-2xl font-light text-amber-700 mt-1">{{ stats.hold }}</div>
              </div>
              
              <div class="bg-red-50 p-4 rounded-lg">
                <div class="text-sm text-red-600 font-light uppercase tracking-wider">Sell</div>
                <div class="text-2xl font-light text-red-700 mt-1">{{ stats.sell }}</div>
              </div>
              
              <div class="bg-gray-100 p-4 rounded-lg">
                <div class="text-sm text-gray-500 font-light uppercase tracking-wider">Unknown</div>
                <div class="text-2xl font-light text-gray-600 mt-1">{{ stats.unknown }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Filter Tabs -->
        <div v-if="!loading && !error" class="mb-6 sm:mb-8 max-w-7xl mx-auto">
          <div class="flex overflow-x-auto pb-2">
            <div class="flex border-b border-gray-200">
              <button 
                v-for="tab in tabs" 
                :key="tab.value"
                @click="activeTab = tab.value"
                :class="[
                  'relative px-3 sm:px-5 py-2 font-light text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 mr-4 sm:mr-6 last:mr-0 whitespace-nowrap',
                  activeTab === tab.value 
                    ? 'text-gray-700' 
                    : 'text-gray-400 hover:text-gray-600'
                ]"
              >
                {{ tab.label }}
                <span 
                  :class="['absolute bottom-0 left-0 w-full h-0.5 bg-gray-500 transform scale-x-0 transition-transform duration-300', { '!scale-x-100': activeTab === tab.value }]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Stocks Table -->
        <div v-if="!loading && !error" class="max-w-7xl mx-auto overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full divide-y divide-gray-200 border-separate" style="border-spacing: 0">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" class="sticky top-0 bg-gray-50 z-10 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="stock in displayedStocks" :key="stock.id" class="hover:bg-gray-50 transition-colors duration-300">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ stock.id }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{{ stock.name || '-' }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-light rounded-full',
                      {
                        'bg-emerald-100 text-emerald-800': stock.model_based_signal?.recommendation === 'BUY',
                        'bg-amber-100 text-amber-800': stock.model_based_signal?.recommendation === 'HOLD',
                        'bg-red-100 text-red-800': stock.model_based_signal?.recommendation === 'SELL',
                        'bg-gray-100 text-gray-800': !stock.model_based_signal?.recommendation
                      }
                    ]">
                      {{ stock.model_based_signal?.recommendation || 'Unknown' }}
                    </span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    <div v-if="stock.model_based_signal?.confidence_score !== undefined" class="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-700 ease-out rounded-full"
                        :class="{
                          'bg-emerald-500': stock.model_based_signal?.recommendation === 'BUY',
                          'bg-amber-500': stock.model_based_signal?.recommendation === 'HOLD',
                          'bg-red-500': stock.model_based_signal?.recommendation === 'SELL',
                          'bg-gray-500': !stock.model_based_signal?.recommendation
                        }"
                        :style="`width: ${stock.model_based_signal?.confidence_score || 0}%`"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500 ml-1">{{ stock.model_based_signal?.confidence_score || '-' }}%</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    ₹{{ 
                      stock.price_projections?.current_price_data?.current_price?.toFixed(2) || 
                      stock.analysis_metadata?.current_price?.toFixed(2) || 
                      stock.price?.toFixed(2) || 
                      '-'
                    }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <router-link :to="`/stock/${stock.id}`" class="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination controls -->
          <div class="flex justify-between items-center mt-8 sm:mt-10">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ pagination.start + 1 }}</span> to 
              <span class="font-medium">{{ Math.min(pagination.end, filteredStocks.length) }}</span> of 
              <span class="font-medium">{{ filteredStocks.length }}</span> stocks
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="previousPage" 
                :disabled="pagination.page === 1" 
                :class="[
                  'p-2 rounded-lg transition-colors duration-300',
                  pagination.page === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                @click="nextPage" 
                :disabled="pagination.page >= Math.ceil(filteredStocks.length / pagination.perPage)" 
                :class="[
                  'p-2 rounded-lg transition-colors duration-300',
                  pagination.page >= Math.ceil(filteredStocks.length / pagination.perPage)
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
const pagination = ref({
  page: 1,
  perPage: 25,
  start: 0,
  end: 25
})

// Filter tabs
const tabs = [
  { label: 'All Stocks', value: 'all' },
  { label: 'Buy', value: 'BUY' },
  { label: 'Hold', value: 'HOLD' },
  { label: 'Sell', value: 'SELL' },
]

// Stats from API
const stats = ref({
  total: 0,
  buy: 0,
  hold: 0,
  sell: 0,
  unknown: 0
})

// Computed properties
const filteredStocks = computed(() => {
  if (activeTab.value === 'all') {
    return stocks.value
  }
  
  return stocks.value.filter(stock => 
    stock.model_based_signal?.recommendation === activeTab.value
  )
})

const displayedStocks = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  
  pagination.value.start = start
  pagination.value.end = end
  
  return filteredStocks.value.slice(start, end)
})

// Fetch all stocks without pagination
const fetchAllStocks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/top-all')
    const data = await response.json()
    
    // Update stats
    stats.value = data.counts
    
    // Set full stock list
    stocks.value = data.all
    
    // Reset pagination
    pagination.value.page = 1
  } catch (err) {
    console.error('Failed to fetch all stocks:', err)
    error.value = 'Failed to load stock data. Please try again.'
  } finally {
    loading.value = false
  }
}

// Pagination methods
const nextPage = () => {
  if (pagination.value.page < Math.ceil(filteredStocks.value.length / pagination.value.perPage)) {
    pagination.value.page++
    scrollToTop()
  }
}

const previousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for tab changes
watch(activeTab, () => {
  pagination.value.page = 1 // Reset to page 1 when changing tabs
})

// Fetch all stocks on mount
onMounted(() => {
  fetchAllStocks()
})
</script> 