import { db } from './firebase-admin.js'

export default defineEventHandler(async (event) => {
  try {
    // Fetch all stock data from Firestore
    const snapshot = await db.collection('stock_analyses').get()
    const allStocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Sort stocks by ticker/id for easy viewing
    allStocks.sort((a, b) => {
      // First try to sort by name if available
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      // Fall back to id
      return a.id.localeCompare(b.id)
    })
    
    // Group by recommendation type
    const stocksByRecommendation = {
      BUY: allStocks.filter(stock => stock.model_based_signal?.recommendation === 'BUY'),
      HOLD: allStocks.filter(stock => stock.model_based_signal?.recommendation === 'HOLD'),
      SELL: allStocks.filter(stock => stock.model_based_signal?.recommendation === 'SELL'),
      UNKNOWN: allStocks.filter(stock => !stock.model_based_signal?.recommendation)
    }
    
    // Return both the full list and the categorized lists
    return {
      all: allStocks,
      byRecommendation: stocksByRecommendation,
      counts: {
        total: allStocks.length,
        buy: stocksByRecommendation.BUY.length,
        hold: stocksByRecommendation.HOLD.length,
        sell: stocksByRecommendation.SELL.length,
        unknown: stocksByRecommendation.UNKNOWN.length
      }
    }
  } catch (error) {
    console.error('Error fetching all stocks:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch stock data',
      data: { error: error.message }
    })
  }
}) 