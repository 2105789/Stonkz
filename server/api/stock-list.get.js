import { db } from './firebase-admin.js'

export default defineEventHandler(async (event) => {
  const snapshot = await db.collection('stock_analyses').get()
  // Return array of { id, ...fields }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})
