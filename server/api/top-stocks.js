import { db } from './firebase-admin.js'

export default defineEventHandler(async (event) => {
  // Fetch all stock data from Firestore
  const snapshot = await db.collection('stock_analyses').get()
  const allStocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Group stocks by recommendation type
  const buyStocks = []
  const holdStocks = []
  const sellStocks = []
  
  // Process each stock and categorize by recommendation
  allStocks.forEach(stock => {
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