#!/usr/bin/env node

console.log('🎯 FRESH WORKER - Iniciado em:', new Date().toISOString())
console.log('📋 Process ID:', process.pid)
console.log('🔧 Node Version:', process.version)
console.log('📂 Working Directory:', process.cwd())
console.log('🌍 Environment:', process.env.NODE_ENV || 'development')

// Worker que apenas mantém processo vivo
let counter = 0

const heartbeat = setInterval(() => {
  counter++
  console.log(`💓 Fresh Worker Heartbeat #${counter} - ${new Date().toISOString()}`)
  
  if (counter === 1) {
    console.log('✅ Fresh worker está funcionando perfeitamente!')
    console.log('🚀 Próximo passo: adicionar Redis e BullMQ')
  }
}, 15000)

console.log('🎯 Fresh Worker iniciado com sucesso!')
console.log('⏰ Heartbeat a cada 15 segundos')

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📝 Fresh Worker encerrando...')
  clearInterval(heartbeat)
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('📝 Fresh Worker encerrando...')
  clearInterval(heartbeat)
  process.exit(0)
})