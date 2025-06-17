#!/usr/bin/env node

// Script para fazer deploy do worker via Railway CLI
const { execSync } = require('child_process');

console.log('🚀 Fazendo deploy do worker...');

try {
  // Deploy usando configuração específica para worker
  const result = execSync('railway up --detach', { 
    encoding: 'utf8',
    env: {
      ...process.env,
      RAILWAY_SERVICE_NAME: 'worker',
      START_COMMAND: 'npm run worker'
    }
  });
  
  console.log('✅ Worker deployment iniciado:', result);
} catch (error) {
  console.error('❌ Erro no deploy:', error.message);
}