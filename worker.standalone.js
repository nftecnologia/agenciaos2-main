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
  
  console.log('🔗 REDIS_URL completa:', redisUrl)
  console.log('🔗 Todas as env vars Redis:')
  console.log('  REDIS_URL:', process.env.REDIS_URL)
  console.log('  REDISCLOUD_URL:', process.env.REDISCLOUD_URL)
  console.log('  REDIS_PRIVATE_URL:', process.env.REDIS_PRIVATE_URL)
  
  if (!redisUrl) {
    throw new Error('REDIS_URL não configurado')
  }
  
  // Forçar uso da URL do Railway
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 20000,
    family: 4, // IPv4
    enableOfflineQueue: false,
    retryConnectOnFailover: true,
  })
  
  console.log('✅ Redis configurado com URL:', redisUrl)
} catch (error) {
  console.error('❌ Erro configurando Redis:', error.message)
  process.exit(1)
}

// Configuração da fila - usar URL diretamente para evitar problemas
const redisUrlForBullMQ = process.env.REDIS_URL || process.env.REDISCLOUD_URL || process.env.REDIS_PRIVATE_URL
console.log('🔗 BullMQ usando Redis URL completa:', redisUrlForBullMQ)

// Testar conexão Redis antes de criar worker
async function testRedisConnection() {
  try {
    await redis.ping()
    console.log('✅ Redis conectado com sucesso!')
  } catch (error) {
    console.error('❌ Falha ao conectar Redis:', error.message)
    throw error
  }
}

// Parse da URL do Redis para configuração explícita
const Redis = require('ioredis')
const redisUrlParsed = new URL(redisUrlForBullMQ)

console.log('🔧 Redis URL parseada:')
console.log('  hostname:', redisUrlParsed.hostname)
console.log('  port:', redisUrlParsed.port)
console.log('  password:', redisUrlParsed.password ? '***' : 'sem senha')

// Configuração explícita do Redis para BullMQ
const redisConfig = {
  host: redisUrlParsed.hostname,
  port: parseInt(redisUrlParsed.port),
  password: redisUrlParsed.password,
  db: 0,
  maxRetriesPerRequest: 3,
  connectTimeout: 20000,
  family: 4,
  enableOfflineQueue: false,
}

console.log('🔧 Configuração Redis para BullMQ:', {
  host: redisConfig.host,
  port: redisConfig.port,
  hasPassword: !!redisConfig.password
})

// Criar worker com configuração explícita do Redis
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
  // Usar configuração explícita do Redis
  connection: redisConfig,
  concurrency: 2,
  removeOnComplete: 10,
  removeOnFail: 5,
})

// Testar conexão antes de iniciar
testRedisConnection().catch(error => {
  console.error('❌ Não foi possível conectar ao Redis:', error.message)
  process.exit(1)
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