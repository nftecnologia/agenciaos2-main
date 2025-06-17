# 🚂 Deploy no Railway com Workers

## 📋 Pré-requisitos

1. Conta no Railway (railway.app)
2. Conta no Redis (ou usar Railway Redis)
3. Variáveis de ambiente configuradas

## 🔧 Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis para filas
REDIS_URL=redis://default:password@host:port

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.railway.app

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Node
NODE_ENV=production
```

## 🚀 Passos para Deploy

### 1. Conectar Repositório
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar projeto
railway link
```

### 2. Configurar Redis
```bash
# Adicionar Redis ao projeto
railway add redis

# Obter URL do Redis
railway variables
```

### 3. Deploy da Aplicação Principal
```bash
# Deploy do serviço web
railway up
```

### 4. Configurar Worker Separado

No Railway Dashboard:
1. Vá para seu projeto
2. Clique em "New Service"
3. Selecione "GitHub Repo"
4. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run worker`
   - **Variables**: Mesmas do serviço web

### 5. Configurar Variáveis

No Railway Dashboard para **ambos** os serviços:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-app.railway.app
OPENAI_API_KEY=sk-...
NODE_ENV=production
```

## 📊 Monitoramento

### Logs do Worker
```bash
railway logs --service worker
```

### Logs da Web
```bash
railway logs --service web
```

### Status das Filas
Acesse: `https://your-app.railway.app/api/ebook/queue/status/[jobId]`

## 🔧 Estrutura do Projeto

```
├── worker.js              # Worker para Railway
├── Procfile               # Configuração de processos
├── railway.json           # Configuração Railway
├── src/lib/
│   ├── redis.ts           # Configuração Redis
│   └── queue.ts           # Sistema de filas BullMQ
└── src/app/api/ebook/queue/ # APIs da fila
    ├── description/
    ├── content/
    ├── pdf/
    └── status/[jobId]/
```

## ⚡ Performance

- **Web Service**: Processa requisições HTTP
- **Worker Service**: Processa jobs em background
- **Redis**: Gerencia filas e cache
- **PostgreSQL**: Banco de dados principal

## 🐛 Troubleshooting

### Worker não está processando jobs
```bash
# Verificar logs
railway logs --service worker

# Verificar conexão Redis
railway shell
node -e "console.log(process.env.REDIS_URL)"
```

### Jobs ficam em "waiting"
- Verificar se worker está rodando
- Verificar logs de erro do worker
- Verificar conectividade Redis

### Timeouts na geração
- Aumentar timeout do Railway (Pro plan)
- Otimizar prompts da OpenAI
- Implementar retry logic

## 🔄 Scaling

### Horizontal Scaling
- Railway Pro: Múltiplas replicas do worker
- Load balancing automático

### Vertical Scaling  
- Aumentar recursos do worker
- Otimizar concorrência do BullMQ

## 🎯 Next Steps

1. ✅ Deploy básico funcionando
2. ⏳ Monitoramento avançado
3. ⏳ Auto-scaling
4. ⏳ Backup/Recovery
5. ⏳ CI/CD Pipeline