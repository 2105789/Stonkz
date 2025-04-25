import { db } from './firebase-admin.js'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  if (!id) return { error: 'Missing id' }
  const doc = await db.collection('stock_analyses').doc(id).get()
  if (!doc.exists) return { error: 'Not found' }
  return { id: doc.id, ...doc.data() }
})
