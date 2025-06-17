# 🚀 DEPLOY IMEDIATO - Railway

Execute estes comandos **em sequência** no seu terminal:

## 1. Criar Projeto Railway

```bash
cd /Users/oliveira/Desktop/agenciaos2-main

# Criar projeto (vai abrir seletor - escolha "Create new project")
railway init

# Nome sugerido: agenciaos
```

## 2. Adicionar Redis

```bash
# Adicionar Redis automaticamente
railway add redis
```

## 3. Gerar e Configurar Variáveis

```bash
# Gerar secret seguro
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Configurar variáveis essenciais
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
railway variables set NODE_ENV="production"

# SUBSTITUA pela sua chave OpenAI real
railway variables set OPENAI_API_KEY="sk-sua-chave-openai-aqui"
```

## 4. Deploy do Serviço Principal

```bash
# Fazer deploy do app web
railway up
```

## 5. Obter Informações do Deploy

```bash
# Ver variáveis criadas (incluindo REDIS_URL)
railway variables

# Ver URL do app
railway status

# Abrir app no browser
railway open
```

## 6. Configurar Worker (Manual via Dashboard)

1. Acesse https://railway.app
2. Encontre seu projeto "agenciaos"
3. Clique em **"New Service"**
4. Selecione **"GitHub Repo"**
5. Conecte este repositório
6. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run worker`
7. **Environment Variables**: 
   - Copie TODAS as variáveis do serviço web
   - Especialmente: `REDIS_URL`, `DATABASE_URL`, `NEXTAUTH_SECRET`

## 7. Configurar Banco de Dados

### Opção A: Usar Railway PostgreSQL
```bash
railway add postgresql
```

### Opção B: Usar seu banco existente
```bash
railway variables set DATABASE_URL="sua-connection-string-postgresql"
```

## 8. Finalizar URL do NextAuth

```bash
# Após deploy, obter URL e configurar
RAILWAY_URL=$(railway status | grep "URL" | awk '{print $2}')
railway variables set NEXTAUTH_URL="$RAILWAY_URL"
```

## 🎯 Verificação Final

```bash
# Verificar logs
railway logs

# Status dos serviços
railway status

# Se tudo estiver OK, teste o app
railway open
```

## 🚨 Se algo der errado

```bash
# Restart todos os serviços
railway restart

# Ver logs detalhados
railway logs --follow
```

---

## ⚡ Execução Rápida (Copie e Cole)

```bash
cd /Users/oliveira/Desktop/agenciaos2-main
railway init
railway add redis
NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
railway variables set NODE_ENV="production"
railway variables set OPENAI_API_KEY="sk-SUBSTITUA-PELA-SUA-CHAVE"
railway up
railway variables
railway open
```

Depois configure o worker manualmente no dashboard!