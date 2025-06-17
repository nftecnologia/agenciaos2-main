// Worker para Railway - Processa jobs em background
require('dotenv').config()
const { ebookWorker } = require('./dist/lib/queue.js')

console.log('🚀 Worker de ebooks iniciado')
console.log('📊 Aguardando jobs na fila...')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 Recebido SIGTERM, fechando worker...')
  await ebookWorker.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('📴 Recebido SIGINT, fechando worker...')
  await ebookWorker.close()
  process.exit(0)
})

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})