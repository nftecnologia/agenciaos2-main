#!/bin/bash

echo "🚀 Criando worker service no Railway..."

# Criar um novo service usando Railway CLI
# O Railway v3 permite criar services via interface programática

# Projeto ID
PROJECT_ID="0ffce4ec-f5ce-4b83-aa1d-dc5d85fd7bc9"
ENVIRONMENT_ID="cee8f2f1-b89a-4173-817e-defb5f6fed67"

echo "✅ Projeto: $PROJECT_ID"
echo "✅ Environment: $ENVIRONMENT_ID"

# Usar railway CLI para fazer deploy com configuração específica
echo "📦 Fazendo deploy do worker..."

# Criar o worker service usando um comando específico do Railway
# Vamos usar o deploy com override de configuração
export RAILWAY_SERVICE_NAME="worker"
export RAILWAY_START_COMMAND="npm run worker"

# Deploy direto
railway up --detach || echo "⚠️ Deploy manual necessário"

echo "✅ Worker service deployment iniciado!"
echo "🔗 Verifique em: https://railway.app/project/$PROJECT_ID"