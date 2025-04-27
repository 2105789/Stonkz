<template>
  <div>
    <NavigationHeader />
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 py-3 px-3 sm:py-6 sm:px-4 md:px-6 lg:px-8">
      <div v-if="pending" class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p class="ml-4 text-gray-600">Loading Analysis...</p>
      </div>
      <div v-else-if="error" class="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-red-100">
        <h2 class="text-xl sm:text-2xl font-semibold text-red-700 mb-3">Error Loading Data</h2>
        <p class="text-red-600 mb-4">Could not fetch the analysis details. Please try again later.</p>
        <pre class="bg-red-50 p-3 rounded text-sm text-red-800 overflow-x-auto">{{ error }}</pre>
        <NuxtLink to="/" class="mt-6 inline-block text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out font-medium">
          ← Back to Home
        </NuxtLink>
      </div>
      <div v-else-if="doc" class="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <!-- Header -->
        <header class="flex flex-col p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-start gap-3 mb-3 sm:mb-0">
            <div class="bg-indigo-600 rounded-full p-2 hidden sm:flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">{{ doc.id }} 
                <span class="block sm:inline text-lg sm:text-xl font-medium text-gray-500">({{ doc.analysis_metadata?.symbol || 'N/A' }})</span>
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">
                Analysis as of: {{ formatDate(doc.analysis_metadata?.analysis_timestamp_str) }}
                <span v-if="doc.analysis_metadata?.validation_timestamp" class="block sm:inline mt-1 sm:mt-0"> | Validated: {{ formatDate(doc.analysis_metadata?.validation_timestamp) }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
            <p v-if="doc.price_projections?.current_price_data?.current_price" class="text-xl sm:text-2xl font-semibold text-indigo-700">
              Current Price: ₹{{ doc.price_projections.current_price_data.current_price.toFixed(2) }}
            </p>
            
            <div class="flex flex-col mt-2 sm:mt-0 sm:items-end">
              <div v-if="doc.confidence_level" class="mb-2">
                <span :class="getConfidenceBadgeClass(doc.confidence_level.rating)" class="text-xs font-medium px-3 py-1 rounded-full">
                  {{ doc.confidence_level.rating }} CONFIDENCE ({{ doc.confidence_level.score }}/100)
                </span>
              </div>
              <div v-if="doc.model_based_signal">
                <span :class="getRecommendationBadgeClass(doc.model_based_signal.recommendation)" class="text-sm font-bold px-3 py-1 rounded-full mr-2">
                  {{ doc.model_based_signal.recommendation }}
                </span>
                <span class="text-xs sm:text-sm text-gray-600">(Score: {{ doc.model_based_signal.confidence_score }}/100)</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Disclaimer -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-xl shadow-sm">
          <p class="text-xs sm:text-sm text-yellow-800">{{ doc.disclaimer }}</p>
        </div>

        <!-- Validation Notes -->
        <div v-if="doc.analysis_metadata?.validation_notes?.length > 0" class="bg-orange-50 border-l-4 border-orange-400 p-3 sm:p-4 rounded-xl shadow-sm">
          <h3 class="text-xs sm:text-sm font-semibold text-orange-800 mb-1">Validation Notes:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(note, index) in doc.analysis_metadata.validation_notes" :key="`val-${index}`" class="text-xs sm:text-sm text-orange-700">
              {{ note }}
            </li>
          </ul>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 gap-4 sm:gap-6">

          <!-- News Headlines -->
          <BaseCard title="Recent News Headlines">
            <ul class="space-y-3">
              <li v-for="(news, index) in doc.news_headlines" :key="`news-${index}`" class="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                <span :class="getImpactDotClass(news.impact)" class="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5" aria-hidden="true"></span>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ news.headline }}</p>
                  <p class="text-xs text-gray-500">
                    {{ news.date }} - <span :class="getImpactTextColor(news.impact)">Impact: {{ news.impact }}</span>
                  </p>
                </div>
              </li>
              <li v-if="!doc.news_headlines || doc.news_headlines.length === 0" class="text-gray-500 text-sm">
                No recent news headlines found.
              </li>
            </ul>
          </BaseCard>

          <!-- Trading Strategy -->
          <BaseCard title="Trading Strategy">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 class="font-semibold text-gray-700 mb-2">Key Levels</h4>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Stop Loss:</dt>
                    <dd class="font-medium text-red-600">₹{{ doc.trading_strategy?.stop_loss?.toFixed(2) || 'N/A' }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Risk/Reward Ratio:</dt>
                    <dd class="font-medium text-gray-800">{{ doc.trading_strategy?.risk_reward_ratio?.toFixed(2) || 'N/A' }}</dd>
                  </div>
                </dl>
                <h4 class="font-semibold text-gray-700 mt-4 mb-2">Position Sizing</h4>
                <p class="text-sm text-gray-600">{{ doc.trading_strategy?.position_sizing || 'N/A' }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700 mb-2">Potential Entry Points</h4>
                <ul v-if="doc.trading_strategy?.entry_points?.length > 0" class="space-y-2">
                  <li v-for="(entry, i) in doc.trading_strategy.entry_points" :key="`entry-${i}`" class="text-sm border-l-2 border-green-300 pl-2">
                    <span class="font-medium text-green-700">₹{{ entry.price.toFixed(2) }}</span> - {{ entry.reasoning }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">No specific entry points provided.</p>

                <h4 class="font-semibold text-gray-700 mt-4 mb-2">Potential Exit Targets</h4>
                <ul v-if="doc.trading_strategy?.exit_targets?.length > 0" class="space-y-2">
                  <li v-for="(exit, i) in doc.trading_strategy.exit_targets" :key="`exit-${i}`" class="text-sm border-l-2 border-indigo-300 pl-2">
                    <span class="font-medium text-indigo-700">₹{{ exit.price.toFixed(2) }}</span> - {{ exit.reasoning }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">No specific exit targets provided.</p>
              </div>
            </div>
          </BaseCard>

          <!-- Price Projections -->
          <BaseCard title="Price Projections & Data">
            <div class="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 class="font-semibold text-indigo-800 mb-1">Current Price Data</h4>
              <dl class="text-sm space-y-1">
                <div class="flex justify-between"><dt class="text-gray-600">Current:</dt><dd class="font-medium text-indigo-700">₹{{ doc.price_projections?.current_price_data?.current_price?.toFixed(2) || 'N/A' }}</dd></div>
                <div class="flex justify-between"><dt class="text-gray-600">Recent High:</dt><dd class="font-medium text-gray-700">₹{{ doc.price_projections?.current_price_data?.recent_high?.toFixed(2) || 'N/A' }}</dd></div>
                <div class="flex justify-between"><dt class="text-gray-600">Recent Low:</dt><dd class="font-medium text-gray-700">₹{{ doc.price_projections?.current_price_data?.recent_low?.toFixed(2) || 'N/A' }}</dd></div>
              </dl>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <ProjectionItem title="Short Term" :projection="doc.price_projections?.short_term" />
              <ProjectionItem title="Medium Term" :projection="doc.price_projections?.medium_term" />
              <ProjectionItem title="Long Term" :projection="doc.price_projections?.long_term" />
            </div>
          </BaseCard>

          <!-- Strengths & Weaknesses -->
          <BaseCard title="Key Strengths & Weaknesses/Risks">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 class="font-semibold text-green-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Strengths
                </h4>
                <ul v-if="doc.key_strengths?.length > 0" class="space-y-2 list-disc list-inside">
                  <li v-for="(strength, i) in doc.key_strengths" :key="`str-${i}`" class="text-sm text-gray-700">
                    {{ strength }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">No specific strengths listed.</p>
              </div>
              <div>
                <h4 class="font-semibold text-red-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  Weaknesses / Risks
                </h4>
                <ul v-if="doc.key_weaknesses_risks?.length > 0" class="space-y-2 list-disc list-inside">
                  <li v-for="(weakness, i) in doc.key_weaknesses_risks" :key="`weak-${i}`" class="text-sm text-gray-700">
                    {{ weakness }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500">No specific weaknesses or risks listed.</p>
              </div>
            </div>
          </BaseCard>

          <!-- Sentiment Analysis -->
          <BaseCard title="Sentiment Analysis">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SentimentItem title="Short Term" :sentiment="doc.sentiment_analysis?.short_term" />
              <SentimentItem title="Medium Term" :sentiment="doc.sentiment_analysis?.medium_term" />
            </div>
          </BaseCard>

          <!-- Market Sentiment -->
          <BaseCard title="Market Sentiment Analysis">
            <div class="space-y-3 text-sm text-gray-700">
              <p><strong class="font-semibold text-gray-800">Impact on Stock:</strong> {{ doc.market_sentiment?.impact_on_stock || 'N/A' }}</p>
              <p><strong class="font-semibold text-gray-800">Overall Market:</strong> {{ doc.market_sentiment?.overall_market || 'N/A' }}</p>
              <p><strong class="font-semibold text-gray-800">Sector Specific:</strong> {{ doc.market_sentiment?.sector_specific || 'N/A' }}</p>
              <p><strong class="font-semibold text-gray-800">Domestic Factors:</strong> {{ doc.market_sentiment?.domestic_factors || 'N/A' }}</p>
              <p><strong class="font-semibold text-gray-800">Global Factors:</strong> {{ doc.market_sentiment?.global_factors || 'N/A' }}</p>
            </div>
          </BaseCard>

          <!-- Model Based Signal -->
          <BaseCard title="Model Based Signal">
            <div class="mb-4">
              <span :class="getRecommendationBadgeClass(doc.model_based_signal?.recommendation)" class="text-base sm:text-lg font-bold mr-2 px-3 py-1 rounded">
                {{ doc.model_based_signal?.recommendation || 'N/A' }}
              </span>
              <span class="text-sm text-gray-600">(Confidence: {{ doc.model_based_signal?.confidence_score || 'N/A' }}/100)</span>
            </div>
            <h4 class="font-semibold text-gray-700 mb-2 text-sm">Supporting Evidence:</h4>
            <ul v-if="doc.model_based_signal?.supporting_evidence?.length > 0" class="space-y-1 list-disc list-inside text-sm text-gray-600">
              <li v-for="(evidence, i) in doc.model_based_signal.supporting_evidence" :key="`evi-${i}`">
                {{ evidence }}
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">No supporting evidence provided.</p>
          </BaseCard>

          <!-- Model Reliability -->
          <BaseCard title="Model Reliability">
            <p class="text-sm text-gray-600 mb-3">{{ doc.model_reliability?.reliability_rationale || 'No rationale provided.' }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 class="font-semibold text-gray-700 mb-1">Least Reliable</h4>
                <ul v-if="doc.model_reliability?.least_reliable_models?.length > 0" class="list-disc list-inside text-gray-500">
                  <li v-for="(model, i) in doc.model_reliability.least_reliable_models" :key="`least-${i}`">{{ model }}</li>
                </ul>
                <p v-else class="text-gray-500 italic">None specified</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700 mb-1">Most Reliable</h4>
                <ul v-if="doc.model_reliability?.most_reliable_models?.length > 0" class="list-disc list-inside text-gray-500">
                  <li v-for="(model, i) in doc.model_reliability.most_reliable_models" :key="`most-${i}`">{{ model }}</li>
                </ul>
                <p v-else class="text-gray-500 italic">None specified</p>
              </div>
              <div class="sm:col-span-2">
                <h4 class="font-semibold text-gray-700 mb-1">Prediction Inconsistencies</h4>
                <ul v-if="doc.model_reliability?.prediction_inconsistencies?.length > 0" class="list-disc list-inside text-gray-500">
                  <li v-for="(incon, i) in doc.model_reliability.prediction_inconsistencies" :key="`incon-${i}`">{{ incon }}</li>
                </ul>
                <p v-else class="text-gray-500 italic">None specified</p>
              </div>
            </div>
          </BaseCard>

          <!-- Analysis Metadata -->
          <BaseCard title="Analysis Metadata">
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-gray-500">Symbol:</dt><dd class="font-medium text-gray-800">{{ doc.analysis_metadata?.symbol || 'N/A' }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Current Price (at analysis):</dt><dd class="font-medium text-gray-800">₹{{ doc.analysis_metadata?.current_price?.toFixed(2) || 'N/A' }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Analysis Timestamp:</dt><dd class="font-medium text-gray-800">{{ formatFullDateTime(doc.analysis_metadata?.analysis_timestamp_str) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Validation Performed:</dt><dd class="font-medium text-gray-800">{{ doc.analysis_metadata?.validation_performed ? 'Yes' : 'No' }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Validation Timestamp:</dt><dd class="font-medium text-gray-800">{{ formatFullDateTime(doc.analysis_metadata?.validation_timestamp) }}</dd></div>
              <div class="flex justify-between"><dt class="text-gray-500">Data Uploaded At:</dt><dd class="font-medium text-gray-800">{{ formatFirestoreTimestamp(doc.analysis_metadata?.uploaded_at) }}</dd></div>
            </dl>
          </BaseCard>

        </div>

      </div>
      <div v-else class="text-center text-gray-500 py-10">
        No data available for this ID.
      </div>
      <div class="sticky bottom-0 z-10 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 max-w-7xl mx-auto mt-4">
        <NuxtLink to="/" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-all duration-200 w-full text-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Overview
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useFetch, defineAsyncComponent } from '#imports';
import { computed } from 'vue';
import NavigationHeader from '~/components/NavigationHeader.vue'

// --- Components (Consider extracting to separate files for larger projects) ---

const BaseCard = defineAsyncComponent(() =>
  import('~/components/BaseCard.vue').catch(() => {
    // Fallback or simple div if component loading fails/doesn't exist
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
     // Fallback
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
    // Fallback
     return {
       props: ['title', 'sentiment'],
        render() {
            const sent = this.sentiment || {};
            const outlookClass = getSentimentOutlookClass(sent.outlook); // Needs helper function access
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


// --- Data Fetching ---
const route = useRoute();
// Use a computed property for the API URL to ensure reactivity if needed
const apiUrl = computed(() => `/api/stock-detail?id=${route.params.id}`);
const { data: doc, pending, error } = await useFetch(apiUrl, {
  // Optional: Add key for better caching/refetching if params change
  key: `stock-${route.params.id}`,
   // Optional: Transform data right after fetching
  transform: (data) => {
    // Add any initial data processing here if needed
    // console.log("Fetched data:", data);
    return data;
  }
});

// --- Helper Functions ---

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Handle different possible date formats (simple string, ISO)
    const date = new Date(dateString);
     if (isNaN(date.getTime())) {
        // If parsing failed, return original string or handle specific cases
        if (typeof dateString === 'string' && dateString.match(/^[A-Za-z]+ \d{4}$/)) { // e.g., "April 2025"
            return dateString;
        }
         if (typeof dateString === 'string' && dateString.match(/^[A-Za-z]{3} \d{1,2} \d{4}$/)) { // e.g., "Apr 23 2025"
             return dateString;
         }
        return dateString; // Return original if format is unexpected
     }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString; // Return original string if error
  }
};

const formatFullDateTime = (dateString) => {
  if (!dateString) return 'N/A';
   try {
      const date = new Date(dateString);
       if (isNaN(date.getTime())) return dateString; // Return original if invalid
      return date.toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
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
    return formatFullDateTime(date.toISOString()); // Reuse the full date formatter
  } catch (e) {
    console.error("Error formatting Firestore timestamp:", timestamp, e);
    return 'Invalid Timestamp';
  }
};


const getImpactStyling = (impact) => {
  const impactLower = impact?.toLowerCase() || '';
  if (impactLower.includes('positive')) {
    return { dot: 'bg-green-500', text: 'text-green-600' };
  } else if (impactLower.includes('negative')) {
    return { dot: 'bg-red-500', text: 'text-red-600' };
  } else if (impactLower.includes('neutral')) {
    return { dot: 'bg-yellow-500', text: 'text-yellow-600' };
  } else {
    return { dot: 'bg-gray-400', text: 'text-gray-500' };
  }
};

const getImpactDotClass = (impact) => getImpactStyling(impact).dot;
const getImpactTextColor = (impact) => getImpactStyling(impact).text;

const getSentimentOutlookClass = (outlook) => {
    const outlookLower = outlook?.toLowerCase() || 'neutral';
     switch (outlookLower) {
        case 'positive':
        case 'bullish':
            return 'text-green-700';
        case 'negative':
        case 'bearish':
            return 'text-red-700';
        case 'neutral':
        default:
            return 'text-yellow-700';
    }
};

const getRecommendationBadgeClass = (recommendation) => {
    const recLower = recommendation?.toLowerCase() || 'hold';
     switch (recLower) {
        case 'buy':
        case 'strong buy':
            return 'bg-green-100 text-green-700 border border-green-200';
        case 'sell':
        case 'strong sell':
             return 'bg-red-100 text-red-700 border border-red-200';
        case 'hold':
        default:
             return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    }
};

const getConfidenceBadgeClass = (rating) => {
    const ratingLower = rating?.toLowerCase() || 'low';
    switch(ratingLower) {
        case 'high':
            return 'bg-green-100 text-green-700 border border-green-200';
        case 'medium':
             return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case 'low':
        default:
             return 'bg-red-100 text-red-700 border border-red-200';

    }
}

</script>

<style scoped>
/* Add any component-specific styles here if needed, though Tailwind covers most cases */
/* Example: Smooth scrolling if the page gets very long */
html {
  scroll-behavior: smooth;
}
</style>