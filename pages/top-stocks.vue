<template>
  <div>
    <NavigationHeader />
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Top Stock Recommendations</h1>
          <p class="text-gray-600">Find the most confident stock recommendations sorted by confidence score</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex justify-center mb-8">
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
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="stock in filteredStocks" 
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationHeader from '../components/NavigationHeader.vue'

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Buy', value: 'BUY' },
  { label: 'Hold', value: 'HOLD' },
  { label: 'Sell', value: 'SELL' }
]

const activeTab = ref('ALL')
const stocks = ref([])
const loading = ref(true)
const error = ref(null)

const filteredStocks = computed(() => {
  if (activeTab.value === 'ALL') {
    return stocks.value
  }
  return stocks.value.filter(stock => 
    stock.model_based_signal && 
    stock.model_based_signal.recommendation === activeTab.value
  )
})

const fetchStocks = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch top stocks from API
    const response = await fetch('/api/top-stocks')
    if (!response.ok) {
      throw new Error('Failed to fetch top stocks')
    }
    
    const data = await response.json()
    
    // Sort by confidence score in descending order
    stocks.value = data.sort((a, b) => 
      b.model_based_signal.confidence_score - a.model_based_signal.confidence_score
    )
  } catch (err) {
    console.error('Error fetching top stocks:', err)
    error.value = 'Failed to load stock recommendations. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStocks)
</script> 