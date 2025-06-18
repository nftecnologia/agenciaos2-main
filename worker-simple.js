#!/usr/bin/env node

// Worker super simples para teste
console.log('🚀 WORKER SIMPLES INICIADO')
console.log('📅 Timestamp:', new Date().toISOString())
console.log('🔧 Node version:', process.version)

// Apenas teste sem dependências
setTimeout(() => {
  console.log('✅ Worker simples funcionando - aguardando 10 segundos...')
}, 1000)

setTimeout(() => {
  console.log('✅ Worker ainda funcionando - 10 segundos se passaram!')
}, 10000)

// Loop infinito para manter o worker vivo
setInterval(() => {
  console.log('💓 Worker alive:', new Date().toISOString())
}, 30000)