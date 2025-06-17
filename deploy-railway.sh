#!/bin/bash

echo "🚂 Script de Deploy Railway - AgênciaOS"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Passo 1: Login no Railway${NC}"
echo "Execute: railway login"
echo "Isso abrirá o browser para autenticação"
echo ""

echo -e "${BLUE}Passo 2: Criar projeto${NC}"
echo "Execute: railway init agenciaos"
echo ""

echo -e "${BLUE}Passo 3: Adicionar Redis${NC}"
echo "Execute: railway add redis"
echo ""

echo -e "${BLUE}Passo 4: Configurar variáveis de ambiente${NC}"
echo "Execute os comandos abaixo (substitua pelos seus valores):"
echo ""
echo "railway variables set DATABASE_URL=\"postgresql://user:pass@host:port/db\""
echo "railway variables set NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
echo "railway variables set OPENAI_API_KEY=\"sk-your-openai-key\""
echo "railway variables set NODE_ENV=\"production\""
echo ""

echo -e "${BLUE}Passo 5: Deploy do serviço web${NC}"
echo "Execute: railway up"
echo ""

echo -e "${BLUE}Passo 6: Obter URL do Redis${NC}"
echo "Execute: railway variables"
echo "Anote o REDIS_URL que foi criado automaticamente"
echo ""

echo -e "${BLUE}Passo 7: Criar serviço worker${NC}"
echo "No Railway Dashboard (railway.app):"
echo "1. Vá para seu projeto"
echo "2. Clique em 'New Service'"
echo "3. Selecione 'GitHub Repo'"
echo "4. Conecte o mesmo repositório"
echo "5. Configure:"
echo "   - Build Command: npm run build"
echo "   - Start Command: npm run worker"
echo "6. Adicione as mesmas variáveis de ambiente do serviço web"
echo ""

echo -e "${BLUE}Passo 8: Verificar status${NC}"
echo "Execute: railway status"
echo ""

echo -e "${GREEN}🎉 Deploy completo!${NC}"
echo "Acesse: railway open"
echo ""

echo -e "${YELLOW}📊 Para monitorar:${NC}"
echo "Logs web: railway logs"
echo "Logs worker: railway logs --service worker"
echo ""

echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo "Se der erro de conexão Redis:"
echo "1. Verifique: railway variables | grep REDIS"
echo "2. Restart serviços: railway restart"
echo ""