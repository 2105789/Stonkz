import { db } from '../firebase-admin.js'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    if (!id) return { error: 'Missing id' }
    
    const doc = await db.collection('stock_analyses').doc(id).get()
    if (!doc.exists) return { error: 'Not found' }
    
    // Return the full document data
    const data = { 
      id: doc.id, 
      ...doc.data()
    }
    
    // Log for debugging
    console.log(`API Response for ${id}: ${JSON.stringify(data).substring(0, 200)}...`)
    
    return data
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return { 
      error: 'Failed to fetch stock data', 
      details: error.message 
    }
  }
}) 