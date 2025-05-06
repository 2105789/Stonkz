<template>
  <div class="min-h-screen flex flex-col">
    <NavigationHeader />
    <MobileNavigation />
    <div class="flex-1 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 pt-1 sm:pt-1 px-3 sm:px-4 md:px-6 lg:px-8 pb-28 md:pb-12 md:ml-20">
      <div v-if="pending" class="flex justify-center items-center h-[70vh]">
        <div class="animate-spin h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 border-t-2 border-emerald-500"></div>
        <p class="ml-4 sm:ml-6 text-emerald-600 uppercase tracking-wider text-sm font-light">Loading Analysis</p>
      </div>
      <div v-else-if="error" class="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 border border-emerald-200 mt-6 rounded-xl shadow-sm">
        <h2 class="text-lg sm:text-xl md:text-2xl font-light tracking-wider text-gray-800 uppercase mb-4 sm:mb-6">Error Loading Data</h2>
        <p class="text-gray-700 mb-6 font-light text-sm sm:text-base">Could not fetch the analysis details. Please try again later.</p>
        <pre class="bg-gray-50 p-3 sm:p-5 text-xs sm:text-sm text-gray-600 overflow-x-auto font-light rounded-lg">{{ error }}</pre>
        <NuxtLink to="/" class="mt-6 sm:mt-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 transition duration-300 font-light uppercase tracking-wider text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>
      <div v-else-if="doc" class="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pt-4 sm:pt-6">
        <!-- Header - Redesigned to be more modern and consistent with homepage -->
        <div class="bg-white rounded-xl overflow-hidden shadow-sm">
          <!-- Visual header with gradient -->
          <div class="h-5 md:h-12 relative overflow-hidden"
            :class="{
              'bg-gradient-to-r from-emerald-600 to-teal-600': doc.model_based_signal?.recommendation === 'BUY',
              'bg-gradient-to-r from-amber-500 to-orange-500': doc.model_based_signal?.recommendation === 'HOLD',
              'bg-gradient-to-r from-red-600 to-rose-600': doc.model_based_signal?.recommendation === 'SELL',
              'bg-gradient-to-r from-gray-500 to-slate-600': !doc.model_based_signal?.recommendation
            }"
          >
            <div class="absolute bottom-0 right-0 h-20 w-20 sm:h-24 sm:w-24 bg-white/10 rounded-full -mb-10 -mr-10 sm:-mb-12 sm:-mr-12"></div>
            <div class="absolute top-0 left-1/4 h-8 w-8 sm:h-12 sm:w-12 bg-white/5 rounded-full -mt-4 sm:-mt-6"></div>
          </div>
          
          <!-- Content section -->
          <div class="p-4 sm:p-6 md:p-8">
            <div class="flex flex-col sm:flex-row justify-between">
              <!-- Stock name and info -->
              <div class="mb-5 sm:mb-0">
                <div class="flex items-center">
                  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-sm flex items-center justify-center mr-3 sm:mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h1 class="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-gray-900">
                    {{ doc.id }}
                    <span class="block sm:inline text-sm sm:text-lg md:text-xl font-extralight text-gray-600 ml-0 sm:ml-2">({{ doc.analysis_metadata?.symbol || 'N/A' }})</span>
                  </h1>
                </div>
                
                <p v-if="doc.price_projections?.current_price_data?.current_price" class="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 mt-3 sm:mt-4">
                  ₹{{ doc.price_projections.current_price_data.current_price.toFixed(2) }}
                </p>
                
                <p class="text-xs text-gray-500 mt-2 font-light">
                  Analysis: {{ formatDate(doc.analysis_metadata?.analysis_timestamp_str) }}
                  <span class="block sm:inline mt-1 sm:mt-0 sm:ml-4"> Validated: {{ formatDate(doc.analysis_metadata?.validation_timestamp) }}</span>
                </p>
              </div>
              
              <!-- Recommendation and confidence -->
              <div class="flex flex-col items-start sm:items-end">
                <div v-if="doc.model_based_signal" class="mb-3 sm:mb-4">
                  <span 
                    :class="[
                      'inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium tracking-wider uppercase',
                      doc.model_based_signal.recommendation === 'BUY' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : doc.model_based_signal.recommendation === 'SELL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    ]"
                  >
                    <span class="mr-1.5">
                      <svg v-if="doc.model_based_signal.recommendation === 'BUY'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <svg v-else-if="doc.model_based_signal.recommendation === 'SELL'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                      </svg>
                    </span>
                  {{ doc.model_based_signal.recommendation }}
                </span>
                </div>
                
                <div v-if="doc.confidence_level" class="mb-2 sm:mb-3">
                  <div class="flex items-center">
                    <div class="w-16 xs:w-20 sm:w-28 md:w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="h-1.5 rounded-full" 
                        :class="{
                          'bg-emerald-500': doc.confidence_level.rating === 'HIGH',
                          'bg-amber-500': doc.confidence_level.rating === 'MEDIUM',
                          'bg-red-500': doc.confidence_level.rating === 'LOW'
                        }"
                        :style="`width: ${doc.confidence_level.score}%`"
                      ></div>
                    </div>
                    <span class="ml-2 sm:ml-3 text-xs font-medium text-gray-500">{{ doc.confidence_level.score }}/100</span>
                  </div>
                  <p class="mt-1 text-xs font-light text-gray-500 text-right">Confidence: {{ doc.confidence_level.rating }}</p>
                </div>
                
                <div v-if="doc.model_based_signal" class="mt-2">
                  <div class="flex items-center">
                    <div class="w-16 xs:w-20 sm:w-28 md:w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="h-1.5 rounded-full" 
                        :class="{
                          'bg-emerald-500': doc.model_based_signal.recommendation === 'BUY',
                          'bg-amber-500': doc.model_based_signal.recommendation === 'HOLD',
                          'bg-red-500': doc.model_based_signal.recommendation === 'SELL'
                        }"
                        :style="`width: ${doc.model_based_signal.confidence_score}%`"
                      ></div>
                    </div>
                    <span class="ml-2 sm:ml-3 text-xs font-medium text-gray-500">{{ doc.model_based_signal.confidence_score }}/100</span>
                  </div>
                  <p class="mt-1 text-xs font-light text-gray-500 text-right">Signal Strength</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Disclaimer and validation notes combined in a cleaner box -->
        <div class="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
          <div class="flex items-start space-x-3 sm:space-x-4">
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-2 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600 font-light tracking-wide mb-3 sm:mb-4">{{ doc.disclaimer }}</p>
              
              <div v-if="doc.analysis_metadata?.validation_notes?.length > 0" class="mt-3 sm:mt-4 border-t border-emerald-100 pt-3 sm:pt-4">
                <h3 class="text-xs font-light tracking-wider uppercase text-gray-700 mb-2 sm:mb-3">Validation Notes</h3>
                <ul class="space-y-2">
                  <li v-for="(note, index) in doc.analysis_metadata.validation_notes" :key="`val-${index}`" class="text-xs sm:text-sm text-gray-600 font-light ml-3 sm:ml-4 before:content-['—'] before:mr-2 before:text-emerald-500">
              {{ note }}
            </li>
          </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between">
            <p class="text-xs text-gray-500 font-light uppercase tracking-wider">Current Price</p>
            <p class="text-lg sm:text-xl font-light text-gray-800 mt-2">₹{{ doc?.price_projections?.current_price_data?.current_price ? doc.price_projections.current_price_data.current_price.toFixed(2) : '—' }}</p>
        </div>

          <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between">
            <p class="text-xs text-gray-500 font-light uppercase tracking-wider">Recent High</p>
            <p class="text-lg sm:text-xl font-light text-gray-800 mt-2">₹{{ doc?.price_projections?.current_price_data?.recent_high ? doc.price_projections.current_price_data.recent_high.toFixed(2) : '—' }}</p>
        </div>

          <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between">
            <p class="text-xs text-gray-500 font-light uppercase tracking-wider">Recent Low</p>
            <p class="text-lg sm:text-xl font-light text-gray-800 mt-2">₹{{ doc?.price_projections?.current_price_data?.recent_low ? doc.price_projections.current_price_data.recent_low.toFixed(2) : '—' }}</p>
        </div>

          <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between">
            <p class="text-xs text-gray-500 font-light uppercase tracking-wider">Stop Loss</p>
            <p class="text-lg sm:text-xl font-light text-red-600 mt-2">₹{{ doc?.trading_strategy?.stop_loss ? doc.trading_strategy.stop_loss.toFixed(2) : '—' }}</p>
          </div>
        </div>

        <!-- Price Projections, Sentiment and Trading Strategy -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <!-- Price Projections -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-4 sm:px-6 py-3 sm:py-5 border-b border-emerald-100">
              <h2 class="text-base sm:text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Price Projections
              </h2>
            </div>
            
            <div class="p-3 sm:p-5">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div class="p-2 sm:p-3 border border-emerald-100 rounded-lg bg-white">
                  <h4 class="uppercase tracking-wider text-xs font-medium text-gray-700 mb-2">Short Term</h4>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center mb-2">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Range:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm">₹{{ doc && doc.price_projections?.short_term?.price_range_lower ? doc.price_projections.short_term.price_range_lower.toFixed(2) : '—' }} - ₹{{ doc && doc.price_projections?.short_term?.price_range_upper ? doc.price_projections.short_term.price_range_upper.toFixed(2) : '—' }}</span>
                  </div>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Probable:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm text-emerald-600">₹{{ doc && doc.price_projections?.short_term?.most_probable_price ? doc.price_projections.short_term.most_probable_price.toFixed(2) : '—' }}</span>
                  </div>
                </div>
                
                <div class="p-2 sm:p-3 border border-emerald-100 rounded-lg bg-white">
                  <h4 class="uppercase tracking-wider text-xs font-medium text-gray-700 mb-2">Medium Term</h4>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center mb-2">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Range:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm">₹{{ doc && doc.price_projections?.medium_term?.price_range_lower ? doc.price_projections.medium_term.price_range_lower.toFixed(2) : '—' }} - ₹{{ doc && doc.price_projections?.medium_term?.price_range_upper ? doc.price_projections.medium_term.price_range_upper.toFixed(2) : '—' }}</span>
                  </div>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Probable:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm text-emerald-600">₹{{ doc && doc.price_projections?.medium_term?.most_probable_price ? doc.price_projections.medium_term.most_probable_price.toFixed(2) : '—' }}</span>
                  </div>
                </div>
                
                <div class="p-2 sm:p-3 border border-emerald-100 rounded-lg bg-white">
                  <h4 class="uppercase tracking-wider text-xs font-medium text-gray-700 mb-2">Long Term</h4>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center mb-2">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Range:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm">₹{{ doc && doc.price_projections?.long_term?.price_range_lower ? doc.price_projections.long_term.price_range_lower.toFixed(2) : '—' }} - ₹{{ doc && doc.price_projections?.long_term?.price_range_upper ? doc.price_projections.long_term.price_range_upper.toFixed(2) : '—' }}</span>
                  </div>
                  <div class="flex flex-col xs:flex-row items-start xs:items-center">
                    <span class="text-xs text-gray-500 font-light min-w-[3rem]">Probable:</span>
                    <span class="mt-1 xs:mt-0 xs:ml-2 text-xs sm:text-sm text-emerald-600">₹{{ doc && doc.price_projections?.long_term?.most_probable_price ? doc.price_projections.long_term.most_probable_price.toFixed(2) : '—' }}</span>
                  </div>
                </div>
              </div>
              
              
              <div v-if="doc.price_projections?.confidence_score" class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-emerald-100">
                <div class="flex items-center justify-between mb-1.5">
                  <h4 class="uppercase tracking-wider text-xs font-medium text-gray-700">Projection Confidence</h4>
                  <span class="text-xs font-medium text-gray-700">{{ doc.price_projections.confidence_score }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    class="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                    :style="`width: ${doc.price_projections.confidence_score}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sentiment Analysis -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-4 sm:px-6 py-3 sm:py-5 border-b border-emerald-100">
              <h2 class="text-base sm:text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Market Sentiment
              </h2>
            </div>
            
            <div class="p-3 sm:p-5">
              <!-- Sentiment Indicators -->
              <div class="space-y-4 mb-5 sm:mb-6">
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                  <div class="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <h5 class="text-xs font-light text-gray-600 mb-1.5">Short Term</h5>
                    <div class="flex items-center">
                      <span class="text-xs font-medium" 
                        :class="{
                          'text-emerald-600': doc?.sentiment_analysis?.short_term?.outlook === 'BULLISH',
                          'text-red-600': doc?.sentiment_analysis?.short_term?.outlook === 'BEARISH',
                          'text-amber-600': doc?.sentiment_analysis?.short_term?.outlook === 'NEUTRAL'
                        }"
                      >
                        {{ doc?.sentiment_analysis?.short_term?.outlook || 'N/A' }}
                        <span class="text-xs text-gray-500 ml-1" v-if="doc?.sentiment_analysis?.short_term?.confidence_score">
                          ({{ doc.sentiment_analysis.short_term.confidence_score }}%)
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <h5 class="text-xs font-light text-gray-600 mb-1.5">Medium Term</h5>
                    <div class="flex items-center">
                      <span class="text-xs font-medium" 
                        :class="{
                          'text-emerald-600': doc?.sentiment_analysis?.medium_term?.outlook === 'BULLISH',
                          'text-red-600': doc?.sentiment_analysis?.medium_term?.outlook === 'BEARISH',
                          'text-amber-600': doc?.sentiment_analysis?.medium_term?.outlook === 'NEUTRAL'
                        }"
                      >
                        {{ doc?.sentiment_analysis?.medium_term?.outlook || 'N/A' }}
                        <span class="text-xs text-gray-500 ml-1" v-if="doc?.sentiment_analysis?.medium_term?.confidence_score">
                          ({{ doc.sentiment_analysis.medium_term.confidence_score }}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Strengths & Risks and Market Sentiment -->
        <div class="grid grid-cols-1 gap-6 sm:gap-8">
          <!-- Strengths & Risks -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
              <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Key Strengths & Risks
              </h2>
            </div>

            <div class="p-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                  <h4 class="font-light tracking-wider uppercase text-gray-800 mb-4 text-sm flex items-center">
                    <span class="w-4 h-4 bg-emerald-500 mr-2 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                    </span>
                  Strengths
                </h4>
                  <ul v-if="doc.key_strengths?.length > 0" class="space-y-3">
                    <li v-for="(strength, i) in doc.key_strengths" :key="`str-${i}`" class="text-sm text-gray-600 font-light ml-4 before:content-['—'] before:mr-2 before:text-emerald-500">
                    {{ strength }}
                  </li>
                </ul>
                  <p v-else class="text-sm text-gray-500 font-light">No specific strengths listed.</p>
              </div>
              <div>
                  <h4 class="font-light tracking-wider uppercase text-gray-800 mb-4 text-sm flex items-center">
                    <span class="w-4 h-4 bg-red-500 mr-2 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                    </span>
                    Risks
                </h4>
                  <ul v-if="doc.key_weaknesses_risks?.length > 0" class="space-y-3">
                    <li v-for="(weakness, i) in doc.key_weaknesses_risks" :key="`weak-${i}`" class="text-sm text-gray-600 font-light ml-4 before:content-['—'] before:mr-2 before:text-red-500">
                    {{ weakness }}
                  </li>
                </ul>
                  <p v-else class="text-sm text-gray-500 font-light">No specific risks listed.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Trading Strategy -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
              <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Trading Strategy
              </h2>
            </div>
            
            <div class="p-5">
              <div class="grid grid-cols-1 gap-6">
                <!-- Entry Points -->
                <div>
                  <h4 class="text-sm uppercase font-medium text-gray-800 mb-3 flex items-center">
                    <span class="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </span>
                    Entry Points
                  </h4>
                  <ul v-if="doc?.trading_strategy?.entry_points && doc.trading_strategy.entry_points.length > 0" class="space-y-2 ml-6">
                    <li v-for="(entry, i) in doc.trading_strategy.entry_points" :key="`entry-${i}`" class="text-sm relative">
                      <div class="absolute -left-6 top-0 w-0.5 h-full bg-emerald-100"></div>
                      <div class="flex flex-col xs:flex-row xs:justify-between xs:items-center">
                        <span class="text-emerald-600 font-medium mb-1 xs:mb-0">₹{{ entry.price.toFixed(2) }}</span>
                        <span class="text-gray-500 text-xs">{{ entry.reasoning }}</span>
                      </div>
                    </li>
                  </ul>
                  <p v-else class="text-sm text-gray-500 font-light">No specific entry points provided.</p>
                </div>
                
                <!-- Exit Targets -->
                <div>
                  <h4 class="text-sm uppercase font-medium text-gray-800 mb-3 flex items-center">
                    <span class="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                    Exit Targets
                  </h4>
                  <ul v-if="doc?.trading_strategy?.exit_targets && doc.trading_strategy.exit_targets.length > 0" class="space-y-2 ml-6">
                    <li v-for="(exit, i) in doc.trading_strategy.exit_targets" :key="`exit-${i}`" class="text-sm relative">
                      <div class="absolute -left-6 top-0 w-0.5 h-full bg-red-100"></div>
                      <div class="flex flex-col xs:flex-row xs:justify-between xs:items-center">
                        <span class="text-red-600 font-medium mb-1 xs:mb-0">₹{{ exit.price.toFixed(2) }}</span>
                        <span class="text-gray-500 text-xs">{{ exit.reasoning }}</span>
                      </div>
                    </li>
                  </ul>
                  <p v-else class="text-sm text-gray-500 font-light">No specific exit targets provided.</p>
                </div>
                
                <!-- Risk Reward -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-emerald-100 pt-4">
                  <div class="mb-3 sm:mb-0">
                    <span class="text-xs text-gray-500 uppercase font-light">Risk/Reward Ratio</span>
                    <p class="text-lg font-medium text-emerald-600 mt-1">{{ doc?.trading_strategy?.risk_reward_ratio ? doc.trading_strategy.risk_reward_ratio.toFixed(2) : '—' }}</p>
                  </div>
                  
                  <div>
                    <span class="text-xs text-gray-500 uppercase font-light">Position Sizing</span>
                    <p class="text-sm font-medium text-gray-700 mt-1">{{ doc?.trading_strategy?.position_sizing || 'Not specified' }}</p>
                  </div>
                </div>
                
                <!-- Stop Loss (Added separately for visibility) -->
                <div class="border-t border-emerald-100 pt-4">
                  <h4 class="text-sm uppercase font-medium text-gray-800 mb-3 flex items-center">
                    <span class="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </span>
                    Stop Loss
                  </h4>
                  <div class="bg-red-50 rounded-lg p-3 flex items-center">
                    <span class="text-xl font-medium text-red-600">₹{{ doc?.trading_strategy?.stop_loss ? doc.trading_strategy.stop_loss.toFixed(2) : '—' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <!-- News Headlines - First column -->
          <div class="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
              <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Recent News Headlines
              </h2>
            </div>
            <div class="p-5">
              <ul class="space-y-4">
                <li v-for="(news, index) in doc.news_headlines" :key="`news-${index}`" class="flex items-start space-x-4 pb-4 border-b border-emerald-50 last:border-b-0">
                  <span :class="`flex-shrink-0 w-2 h-2 mt-1.5 rounded-full ${getImpactDotClass(news.impact)}`" aria-hidden="true"></span>
                  <div>
                    <p class="text-sm font-normal text-gray-800">{{ news.headline }}</p>
                    <p class="text-xs text-gray-500 mt-1 font-light tracking-wide">
                      {{ news.date }} · <span :class="getImpactTextColor(news.impact)">{{ news.impact }}</span>
                    </p>
                  </div>
                </li>
                <li v-if="!doc.news_headlines || doc.news_headlines.length === 0" class="text-gray-500 text-sm font-light">
                  No recent news headlines found.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Market Sentiment and Model Reliability -->
        <div class="grid grid-cols-1 gap-6 sm:gap-8">
          <!-- Market Sentiment Analysis - Now Full Width -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
              <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Market Sentiment Analysis
              </h2>
            </div>
            
            <div class="p-5">
              <div class="space-y-6">
                <!-- Impact on Stock -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-800 mb-2">Impact on Stock</h3>
                  <p class="text-gray-600">{{ doc?.market_sentiment?.impact_on_stock || 'N/A' }}</p>
                </div>

                <!-- Overall Market -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-800 mb-2">Overall Market</h3>
                  <p class="text-gray-600">{{ doc?.market_sentiment?.overall_market || 'N/A' }}</p>
                </div>

                <!-- Sector Specific -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-800 mb-2">Sector Specific</h3>
                  <p class="text-gray-600">{{ doc?.market_sentiment?.sector_specific || 'N/A' }}</p>
                </div>

                <!-- Domestic and Global Factors -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-sm font-medium text-gray-800 mb-2">Domestic Factors</h3>
                    <p class="text-gray-600">{{ doc?.market_sentiment?.domestic_factors || 'N/A' }}</p>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-sm font-medium text-gray-800 mb-2">Global Factors</h3>
                    <p class="text-gray-600">{{ doc?.market_sentiment?.global_factors || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Model Based Signal and Model Reliability in 2 columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <!-- Model Based Signal -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
                <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Model Based Signal
                </h2>
              </div>
              
              <div class="p-5">
                <div class="mb-6 text-center">
                  <span 
                    :class="[
                      'inline-block px-6 py-3 rounded-lg text-lg font-light tracking-wider uppercase',
                      doc.model_based_signal?.recommendation === 'BUY' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : doc.model_based_signal?.recommendation === 'SELL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    ]"
                  >
                    {{ doc.model_based_signal?.recommendation || 'N/A' }}
                  </span>
                  
                  <div class="mt-3 flex justify-center">
                    <div class="bg-gray-200 h-1.5 w-48 rounded-full overflow-hidden">
                      <div 
                        class="h-full" 
                        :class="{
                          'bg-emerald-500': doc.model_based_signal?.recommendation === 'BUY',
                          'bg-amber-500': doc.model_based_signal?.recommendation === 'HOLD',
                          'bg-red-500': doc.model_based_signal?.recommendation === 'SELL'
                        }"
                        :style="`width: ${doc.model_based_signal?.confidence_score || 0}%;`"
                      ></div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Confidence: {{ doc.model_based_signal?.confidence_score || 'N/A' }}/100</p>
                </div>
                
                <h4 class="font-light tracking-wider uppercase text-gray-800 mb-3 text-sm">Supporting Evidence:</h4>
                <ul v-if="doc.model_based_signal?.supporting_evidence?.length > 0" class="space-y-3">
                  <li v-for="(evidence, i) in doc.model_based_signal.supporting_evidence" :key="`evi-${i}`" class="flex items-start">
                    <span class="mr-2 text-emerald-400 font-light">—</span>
                    <span class="text-sm text-gray-600">{{ evidence }}</span>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">No supporting evidence provided.</p>
              </div>
            </div>

            <!-- Model Reliability -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
                <h2 class="text-lg font-light text-gray-800 tracking-wider flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Model Reliability
                </h2>
              </div>
              
              <div class="p-5">
                <p class="text-sm text-gray-600 mb-4">{{ doc.model_reliability?.reliability_rationale || 'No rationale provided.' }}</p>
                
                <div class="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <h4 class="font-light tracking-wider uppercase text-gray-800 mb-3 text-xs">Most Reliable Models</h4>
                    <ul v-if="doc.model_reliability?.most_reliable_models?.length > 0" class="space-y-2">
                      <li v-for="(model, i) in doc.model_reliability.most_reliable_models" :key="`most-${i}`" class="flex items-start">
                        <span class="mr-2 text-emerald-400 font-light">—</span>
                        <span class="text-sm text-gray-600">{{ model }}</span>
                      </li>
                    </ul>
                    <p v-else class="text-sm text-gray-500 italic">None specified</p>
                  </div>
                    
                  <div>
                    <h4 class="font-light tracking-wider uppercase text-gray-800 mb-3 text-xs">Least Reliable Models</h4>
                    <ul v-if="doc.model_reliability?.least_reliable_models?.length > 0" class="space-y-2">
                      <li v-for="(model, i) in doc.model_reliability.least_reliable_models" :key="`least-${i}`" class="flex items-start">
                        <span class="mr-2 text-gray-400 font-light">—</span>
                        <span class="text-sm text-gray-600">{{ model }}</span>
                      </li>
                    </ul>
                    <p v-else class="text-sm text-gray-500 italic">None specified</p>
                  </div>
                </div>
                
                <div class="mt-4">
                  <h4 class="font-light tracking-wider uppercase text-gray-800 mb-3 text-xs">Prediction Inconsistencies</h4>
                  <ul v-if="doc.model_reliability?.prediction_inconsistencies?.length > 0" class="space-y-2">
                    <li v-for="(incon, i) in doc.model_reliability.prediction_inconsistencies" :key="`incon-${i}`" class="flex items-start">
                      <span class="mr-2 text-amber-400 font-light">—</span>
                      <span class="text-sm text-gray-600">{{ incon }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-sm text-gray-500 italic">None specified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- For debugging - Will be visible only when debug=true in URL -->
      <div v-if="isDebugMode" class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Debug Data</h2>
        <p class="mb-2"><strong>Has Trading Strategy:</strong> {{ doc && doc.trading_strategy ? 'Yes' : 'No' }}</p>
        <div v-if="doc && doc.trading_strategy" class="ml-4">
          <p><strong>Stop Loss:</strong> {{ typeof doc.trading_strategy.stop_loss }} - {{ doc.trading_strategy.stop_loss }}</p>
          <p><strong>Risk/Reward:</strong> {{ typeof doc.trading_strategy.risk_reward_ratio }} - {{ doc.trading_strategy.risk_reward_ratio }}</p>
          <p><strong>Entry Points Count:</strong> {{ doc.trading_strategy.entry_points ? doc.trading_strategy.entry_points.length : 'No entry points' }}</p>
          <p><strong>Exit Targets Count:</strong> {{ doc.trading_strategy.exit_targets ? doc.trading_strategy.exit_targets.length : 'No exit targets' }}</p>
        </div>

        <div class="mt-4">
          <h3 class="text-md font-semibold mb-2">Price Projections Data:</h3>
          <pre class="p-4 bg-gray-800 text-green-400 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(doc && doc.price_projections, null, 2) }}</pre>
        </div>

        <div class="mt-4">
          <h3 class="text-md font-semibold mb-2">Sentiment Analysis Data:</h3>
          <pre class="p-4 bg-gray-800 text-green-400 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(doc && doc.sentiment_analysis, null, 2) }}</pre>
        </div>
        
        <div class="mt-4">
          <h3 class="text-md font-semibold mb-2">Full Response:</h3>
          <pre class="p-4 bg-gray-800 text-green-400 rounded-lg overflow-x-auto text-xs">{{ JSON.stringify(doc, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useFetch, defineAsyncComponent } from '#imports';
import { computed, ref } from 'vue';
import NavigationHeader from '~/components/NavigationHeader.vue'
import MobileNavigation from '../../components/MobileNavigation.vue'

// Check if debug mode is enabled via URL parameter
const route = useRoute();
const isDebugMode = computed(() => route.query.debug === 'true');

// Components
const BaseCard = defineAsyncComponent(() =>
  import('~/components/BaseCard.vue').catch(() => {
    return {
      props: ['title'],
      render() {
        return h('div', { class: 'bg-white p-6 rounded-xl shadow-md border border-gray-200' }, [
          h('h3', { class: 'text-xl font-semibold text-gray-800 mb-4 border-b pb-2' }, this.title),
          this.$slots.default ? this.$slots.default() : null
        ]);
      }
    };
  })
);

const ProjectionItem = defineAsyncComponent(() =>
  import('~/components/ProjectionItem.vue').catch(() => {
    return {
       props: ['title', 'projection'],
        render() {
            const proj = this.projection || {};
            return h('div', {class: 'border p-3 rounded-md bg-gray-50'}, [
                h('h5', {class: 'font-medium text-gray-700 text-sm mb-1'}, this.title),
                 h('p', {class: 'text-xs text-gray-600'}, `Range: ${proj.price_range_lower || 'N/A'} - ${proj.price_range_upper || 'N/A'}`),
                 h('p', {class: 'text-xs text-gray-600'}, `Probable: ${proj.most_probable_price || 'N/A'}`),
                 proj.stop_loss ? h('p', {class: 'text-xs text-red-600'}, `Stop Loss: ${proj.stop_loss}`) : null
            ])
        }
    }
  })
);

const SentimentItem = defineAsyncComponent(() =>
  import('~/components/SentimentItem.vue').catch(() => {
     return {
       props: ['title', 'sentiment'],
        render() {
            const sent = this.sentiment || {};
            const outlookClass = getSentimentOutlookClass(sent.outlook);
            return h('div', { class: 'flex justify-between items-center p-3 rounded-md border bg-white' }, [
              h('span', { class: 'font-medium text-sm text-gray-700' }, this.title),
              h('div', { class: 'text-right' }, [
                h('span', { class: `text-sm font-semibold ${outlookClass}` }, sent.outlook || 'N/A'),
                h('span', { class: 'ml-2 text-xs text-gray-500' }, `(Score: ${sent.confidence_score || 'N/A'})`)
              ])
            ]);
        }
    }
  })
);

// Data Fetching
const apiUrl = computed(() => `/api/stock/${route.params.id}`);
const { data: doc, pending, error } = await useFetch(apiUrl, {
  key: `stock-${route.params.id}`,
  transform: (data) => data
});

// Helper functions for displaying dates
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch (e) {
    return dateStr
  }
}

const formatFullDateTime = (dateString) => {
  if (!dateString) return 'N/A';
   try {
      const date = new Date(dateString);
       if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      });
   } catch (e) {
       console.error("Error formatting full date/time:", dateString, e);
       return dateString;
   }
};

const formatFirestoreTimestamp = (timestamp) => {
  if (!timestamp || typeof timestamp._seconds !== 'number') return 'N/A';
  try {
    const date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
     if (isNaN(date.getTime())) return 'N/A';
    return formatFullDateTime(date.toISOString());
  } catch (e) {
    console.error("Error formatting Firestore timestamp:", timestamp, e);
    return 'Invalid Timestamp';
  }
};

// Helper functions for visual styling
const getImpactDotClass = (impact) => {
  if (!impact) return 'bg-gray-300';

  const impactLower = impact.toLowerCase();
  if (impactLower.includes('positive')) {
    return 'bg-emerald-500';
  } else if (impactLower.includes('negative')) {
    return 'bg-red-500';
  } else if (impactLower.includes('neutral')) {
    return 'bg-amber-400';
  }
  
  return 'bg-gray-300';
};

const getImpactTextColor = (impact) => {
  if (!impact) return 'text-gray-500';
  
  const impactLower = impact.toLowerCase();
  if (impactLower.includes('positive')) {
    return 'text-emerald-600';
  } else if (impactLower.includes('negative')) {
    return 'text-red-600';
  } else if (impactLower.includes('neutral')) {
    return 'text-amber-600';
  }
  
  return 'text-gray-500';
};

const getSentimentOutlookClass = (outlook) => {
    const outlookLower = outlook?.toLowerCase() || 'neutral';
     switch (outlookLower) {
        case 'positive':
        case 'bullish':
      return 'text-emerald-600';
        case 'negative':
        case 'bearish':
      return 'text-red-600';
        case 'neutral':
        default:
      return 'text-amber-600';
    }
};

const getRecommendationBadgeClass = (recommendation) => {
  if (!recommendation) return 'bg-gray-100 text-gray-500 border-gray-200';
  
  const recLower = recommendation.toLowerCase();
  if (recLower.includes('buy')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (recLower.includes('sell')) {
    return 'bg-red-50 text-red-700 border-red-200';
  } else if (recLower.includes('hold')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const getConfidenceBadgeClass = (rating) => {
  if (!rating) return 'bg-gray-100 text-gray-500 border-gray-200';
  
  const ratingLower = rating.toLowerCase();
  if (ratingLower.includes('high')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (ratingLower.includes('medium')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (ratingLower.includes('low')) {
    return 'bg-red-50 text-red-700 border-red-200';
  }
  
  return 'bg-gray-100 text-gray-500 border-gray-200';
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>