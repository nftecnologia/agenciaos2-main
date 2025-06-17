#!/bin/bash

# Script para iniciar worker em Railway
echo "🚀 Iniciando worker de ebooks..."

# Verificar se Redis está disponível
if [ -z "$REDIS_URL" ]; then
  echo "❌ REDIS_URL não configurado"
  exit 1
fi

# Verificar se DATABASE_URL está disponível  
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não configurado"
  exit 1
fi

echo "✅ Variáveis de ambiente verificadas"
echo "✅ Redis URL: ${REDIS_URL:0:20}..."
echo "✅ Database URL configurado"

# Executar worker
npm run worker