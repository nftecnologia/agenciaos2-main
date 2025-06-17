#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚂 AgênciaOS - Railway Deploy${NC}"
echo "================================"

# Ler secret gerado
NEXTAUTH_SECRET=$(cat .env.local | grep NEXTAUTH_SECRET | cut -d'=' -f2)

echo -e "${GREEN}✅ Secret NextAuth gerado:${NC} $NEXTAUTH_SECRET"
echo ""

echo -e "${YELLOW}📋 Execute estes comandos manualmente:${NC}"
echo ""
echo "1️⃣  railway init"
echo "2️⃣  railway add redis"
echo "3️⃣  railway variables set NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\""
echo "4️⃣  railway variables set NODE_ENV=\"production\""
echo "5️⃣  railway variables set OPENAI_API_KEY=\"sk-SUA-CHAVE-AQUI\""
echo "6️⃣  railway up"
echo "7️⃣  railway open"
echo ""

echo -e "${BLUE}🔗 Após o deploy:${NC}"
echo "• Configure o worker no Railway Dashboard"
echo "• Adicione PostgreSQL se necessário: railway add postgresql"
echo "• Configure NEXTAUTH_URL com a URL gerada"
echo ""

echo -e "${GREEN}🎯 Pronto! Seu secret está em .env.local${NC}"