# 🚂 Comandos Railway - Deploy Completo

## 1. Preparação

```bash
# Instalar Railway CLI (já feito)
npm install -g @railway/cli

# Fazer login
railway login
```

## 2. Criar Projeto

```bash
# Inicializar projeto Railway
railway init agenciaos

# Conectar ao repositório atual
railway link
```

## 3. Adicionar Redis

```bash
# Adicionar Redis ao projeto
railway add redis
```

## 4. Configurar Variáveis de Ambiente

```bash
# Gerar secret para NextAuth
export NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Configurar variáveis (substitua pelos seus valores)
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
railway variables set OPENAI_API_KEY="sk-sua-chave-aqui"
railway variables set NODE_ENV="production"

# Se você tiver seu próprio banco PostgreSQL
railway variables set DATABASE_URL="postgresql://user:pass@host:port/db"

# Ou adicione PostgreSQL do Railway
railway add postgresql
```

## 5. Deploy do Serviço Web

```bash
# Fazer deploy
railway up

# Obter URL do app
railway open
```

## 6. Configurar Worker (via Dashboard)

1. Acesse [railway.app](https://railway.app)
2. Vá para seu projeto "agenciaos"
3. Clique em **"New Service"**
4. Selecione **"GitHub Repo"**
5. Conecte o mesmo repositório
6. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run worker`
7. **Variables**: Copie todas as variáveis do serviço web

## 7. Verificar Status

```bash
# Ver status dos serviços
railway status

# Ver logs do web
railway logs

# Ver logs do worker (após criar)
railway logs --service worker

# Ver variáveis
railway variables
```

## 8. Comandos Úteis

```bash
# Restart serviços
railway restart

# Abrir app no browser
railway open

# Conectar ao Redis
railway connect redis

# Conectar ao PostgreSQL
railway connect postgresql
```

## 🎯 URLs Importantes

- **App**: https://agenciaos.railway.app
- **Dashboard**: https://railway.app/project/[seu-id]
- **Logs**: Disponíveis no dashboard
- **Metrics**: Monitoramento automático

## 🚨 Troubleshooting

### Redis não conecta
```bash
railway variables | grep REDIS
railway restart
```

### Worker não processa jobs
```bash
railway logs --service worker
# Verificar se REDIS_URL está configurado no worker
```

### Build falha
```bash
railway logs --service web
# Verificar se todas as dependências estão no package.json
```