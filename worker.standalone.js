#!/usr/bin/env node

// Worker standalone que não depende do Next.js build
console.log('🚀 Iniciando worker standalone...')

// Importar apenas o necessário
const { Worker, Queue } = require('bullmq')

// Configuração Redis simples
let redis
try {
  const Redis = require('ioredis')
  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || process.env.REDIS_PRIVATE_URL
  
  console.log('🔗 Verificando Redis URL:', redisUrl ? redisUrl.substring(0, 20) + '...' : 'NÃO CONFIGURADO')
  
  if (!redisUrl) {
    throw new Error('REDIS_URL não configurado')
  }
  
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    family: 4, // IPv4
  })
  
  console.log('✅ Redis configurado')
} catch (error) {
  console.error('❌ Erro configurando Redis:', error.message)
  process.exit(1)
}

// Configuração da fila
const redisConnection = { connection: redis }

// Criar worker
const ebookWorker = new Worker('ebook-generation', async (job) => {
  console.log(`📝 Processando job ${job.id}: ${job.data.step}`)
  
  await job.updateProgress(10)
  
  // Simular processamento
  switch (job.data.step) {
    case 'description':
      await new Promise(resolve => setTimeout(resolve, 2000))
      await job.updateProgress(50)
      await new Promise(resolve => setTimeout(resolve, 1000))
      await job.updateProgress(100)
      return { success: true, step: 'description', description: 'Descrição gerada' }
      
    case 'content':
      await new Promise(resolve => setTimeout(resolve, 3000))
      await job.updateProgress(50)
      await new Promise(resolve => setTimeout(resolve, 2000))
      await job.updateProgress(100)
      return { success: true, step: 'content', content: 'Conteúdo gerado' }
      
    case 'pdf':
      await new Promise(resolve => setTimeout(resolve, 5000))
      await job.updateProgress(50)
      await new Promise(resolve => setTimeout(resolve, 3000))
      await job.updateProgress(100)
      return { success: true, step: 'pdf', pdfUrl: '/generated/ebook.pdf' }
      
    default:
      throw new Error(`Step desconhecido: ${job.data.step}`)
  }
}, {
  connection: redisConnection,
  concurrency: 2,
})

ebookWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completado`)
})

ebookWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} falhou:`, err.message)
})

console.log('✅ Worker standalone iniciado')
console.log('🎯 Aguardando jobs na fila "ebook-generation"...')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📝 Encerrando worker...')
  await ebookWorker.close()
  await redis.disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('📝 Encerrando worker...')
  await ebookWorker.close()
  await redis.disconnect()
  process.exit(0)
})