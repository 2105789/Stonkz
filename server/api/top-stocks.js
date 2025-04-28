import { db } from './firebase-admin.js'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event)
  const priceMin = query.priceMin ? parseFloat(query.priceMin) : null
  const priceMax = query.priceMax ? parseFloat(query.priceMax) : null
  
  // Fetch all stock data from Firestore
  const snapshot = await db.collection('stock_analyses').get()
  const allStocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Apply price filter if specified
  let filteredStocks = allStocks
  if (priceMin !== null || priceMax !== null) {
    filteredStocks = allStocks.filter(stock => {
      const currentPrice = stock.analysis_metadata?.current_price
      
      // Skip stocks without price information
      if (currentPrice === undefined || currentPrice === null) {
        return false
      }
      
      // Apply price range filter
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
  
  // Group stocks by recommendation type
  const buyStocks = []
  const holdStocks = []
  const sellStocks = []
  
  // Process each stock and categorize by recommendation
  filteredStocks.forEach(stock => {
    if (stock.model_based_signal && stock.model_based_signal.recommendation) {
      const recommendation = stock.model_based_signal.recommendation
      
      if (recommendation === 'BUY') {
        buyStocks.push(stock)
      } else if (recommendation === 'HOLD') {
        holdStocks.push(stock)
      } else if (recommendation === 'SELL') {
        sellStocks.push(stock)
      }
    }
  })
  
  // Sort each category by confidence score (highest to lowest)
  const sortByConfidence = (a, b) => {
    const scoreA = a.model_based_signal?.confidence_score || 0
    const scoreB = b.model_based_signal?.confidence_score || 0
    return scoreB - scoreA // Descending order
  }
  
  buyStocks.sort(sortByConfidence)
  holdStocks.sort(sortByConfidence)
  sellStocks.sort(sortByConfidence)
  
  // Return the organized data
  return {
    buy: buyStocks,
    hold: holdStocks,
    sell: sellStocks
  }
})