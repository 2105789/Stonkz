import { db } from './firebase-admin.js'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event)
  const priceMin = query.priceMin ? parseFloat(query.priceMin) : null
  const priceMax = query.priceMax ? parseFloat(query.priceMax) : null
  const recommendationType = query.type || null // 'BUY', 'HOLD', 'SELL', or null for all
  const limit = 9 // Limit to top 9 per category - enough for 1 page
  
  // Build Firestore queries for each recommendation type
  const fetchRecommendations = async (type) => {
    let fbQuery = db.collection('stock_analyses')
      .where('model_based_signal.recommendation', '==', type)
    
    // First get documents matching the recommendation type
    const snapshot = await fbQuery.get()
    
    // Extract data 
    let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Apply price filter if specified
    if (priceMin !== null || priceMax !== null) {
      results = results.filter(stock => {
        const currentPrice = stock.price_projections?.current_price_data?.current_price ||
                             stock.analysis_metadata?.current_price
        
        if (currentPrice === undefined || currentPrice === null) {
          return false
        }
        
        if (priceMin !== null && priceMax !== null) {
          return currentPrice >= priceMin && currentPrice <= priceMax
        } else if (priceMin !== null) {
          return currentPrice >= priceMin
        } else if (priceMax !== null) {
          return currentPrice <= priceMax
        }
        
        return true
      })
    }
    
    // Sort by confidence score
    results.sort((a, b) => {
      const scoreA = a.model_based_signal?.confidence_score || 0
      const scoreB = b.model_based_signal?.confidence_score || 0
      return scoreB - scoreA // Descending order
    })
    
    // Return only the top results
    return results.slice(0, limit)
  }
  
  // If a specific recommendation type is requested, only fetch that type
  if (recommendationType && ['BUY', 'HOLD', 'SELL'].includes(recommendationType)) {
    const results = await fetchRecommendations(recommendationType)
    return {
      buy: recommendationType === 'BUY' ? results : [],
      hold: recommendationType === 'HOLD' ? results : [],
      sell: recommendationType === 'SELL' ? results : []
    }
  }
  
  // Otherwise fetch all recommendation types in parallel
  const [buyStocks, holdStocks, sellStocks] = await Promise.all([
    fetchRecommendations('BUY'),
    fetchRecommendations('HOLD'),
    fetchRecommendations('SELL')
  ])
  
  // Return the organized data
  return {
    buy: buyStocks,
    hold: holdStocks,
    sell: sellStocks
  }
})