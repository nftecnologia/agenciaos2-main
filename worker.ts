#!/usr/bin/env node

import { createEbookWorker } from './src/lib/queue'
import { getRedis } from './src/lib/redis'

async function startWorker() {
  try {
    console.log('🚀 Iniciando worker de ebooks...')
    
    // Verificar conexão Redis
    const redis = getRedis()
    await redis.ping()
    console.log('✅ Redis conectado com sucesso')
    
    // Criar e iniciar worker
    const worker = createEbookWorker()
    
    console.log('✅ Worker de ebooks iniciado com sucesso')
    console.log('🎯 Aguardando jobs na fila "ebook-generation"...')
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📝 Recebido SIGTERM, encerrando worker...')
      await worker.close()
      await redis.disconnect()
      process.exit(0)
    })
    
    process.on('SIGINT', async () => {
      console.log('📝 Recebido SIGINT, encerrando worker...')
      await worker.close()
      await redis.disconnect()
      process.exit(0)
    })
    
  } catch (error) {
    console.error('❌ Erro ao iniciar worker:', error)
    process.exit(1)
  }
}

startWorker()