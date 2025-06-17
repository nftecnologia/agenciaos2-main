#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚂 AgênciaOS - Deploy Manual Railway${NC}"
echo "====================================="
echo ""

# Ler secret já gerado
NEXTAUTH_SECRET=$(cat .env.local | grep NEXTAUTH_SECRET | cut -d'=' -f2)

echo -e "${GREEN}📋 COMANDOS PARA EXECUTAR MANUALMENTE:${NC}"
echo ""

echo -e "${YELLOW}1. Login no Railway:${NC}"
echo "railway login"
echo ""

echo -e "${YELLOW}2. Inicializar projeto:${NC}"
echo "railway init"
echo "# Escolha: Create new project"
echo "# Nome sugerido: agenciaos"
echo ""

echo -e "${YELLOW}3. Adicionar bancos de dados:${NC}"
echo "railway add -d redis"
echo "railway add -d postgresql"
echo ""

echo -e "${YELLOW}4. Configurar variáveis de ambiente:${NC}"
echo "railway variables set NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\""
echo "railway variables set NODE_ENV=\"production\""
echo "railway variables set OPENAI_API_KEY=\"sk-SUBSTITUA-PELA-SUA-CHAVE\""
echo ""

echo -e "${YELLOW}5. Fazer deploy:${NC}"
echo "railway up"
echo ""

echo -e "${YELLOW}6. Obter URL e configurar NextAuth:${NC}"
echo "railway status"
echo "# Copie a URL e execute:"
echo "railway variables set NEXTAUTH_URL=\"https://sua-url.railway.app\""
echo ""

echo -e "${YELLOW}7. Verificar deploy:${NC}"
echo "railway logs"
echo "railway open"
echo ""

echo -e "${RED}🔧 CONFIGURAR WORKER (no Dashboard):${NC}"
echo "1. Acesse: https://railway.app"
echo "2. Vá para projeto 'agenciaos'"
echo "3. Clique 'New Service'"
echo "4. Escolha 'GitHub Repo'"
echo "5. Conecte este repositório"
echo "6. Configure:"
echo "   - Start Command: npm run worker"
echo "   - Copie TODAS as variáveis do serviço web"
echo ""

echo -e "${GREEN}✅ Informações importantes:${NC}"
echo "• NextAuth Secret: $NEXTAUTH_SECRET"
echo "• Worker: worker.js (configurado)"
echo "• Redis: será configurado automaticamente"
echo "• PostgreSQL: será configurado automaticamente"
echo ""

echo -e "${BLUE}🎯 Após o deploy:${NC}"
echo "• Teste a aplicação"
echo "• Verifique logs dos workers"
echo "• Configure sua chave OpenAI real"
echo "• Teste geração de ebooks"