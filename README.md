# 🚀 AgênciaOS - Plataforma SaaS Multi-tenant para Agências de Marketing

<div align="center">
  
![AgênciaOS](https://img.shields.io/badge/AgênciaOS-v0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.9.0-purple.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green.svg)
![Redis](https://img.shields.io/badge/Redis-BullMQ-red.svg)

### 🎯 **Solução All-in-One para Agências de Marketing Digital**

*Gestão de projetos, 31 agentes de IA, automação e controle financeiro em uma única plataforma*

[🌟 **Demonstração**](#-demonstração) • [🚀 **Instalação Rápida**](#-instalação-rápida) • [📚 **Documentação**](#-documentação) • [🤝 **Contribuir**](#-contribuir)

</div>

---

## 📋 **Índice**

- [🎯 Visão Geral](#-visão-geral)
- [✨ Principais Funcionalidades](#-principais-funcionalidades)
- [🔥 Features Implementadas](#-features-implementadas)
- [🤖 31 Agentes de IA](#-31-agentes-de-ia)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [📖 Guia de Uso](#-guia-de-uso)
- [🔧 API Reference](#-api-reference)
- [📊 Banco de Dados](#-banco-de-dados)
- [🛡️ Segurança](#️-segurança)
- [📈 Performance](#-performance)
- [🚀 Deploy](#-deploy)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## 🎯 **Visão Geral**

O **AgênciaOS** é uma plataforma SaaS completa construída especificamente para agências de marketing digital. Com arquitetura multi-tenant robusta, oferece gestão de projetos, automação com IA, controle financeiro e ferramentas de produtividade em uma única solução.

### 🌟 **Por que AgênciaOS?**

- ✅ **31 Agentes de IA especializados** para marketing digital
- ✅ **Arquitetura multi-tenant nativa** com isolamento perfeito
- ✅ **Sistema de filas robusto** para processamento em background
- ✅ **Geração automatizada de ebooks** com IA
- ✅ **Kanban avançado** para gestão de projetos
- ✅ **Controle financeiro completo** com relatórios
- ✅ **Interface ChatGPT integrada** com modelos mais recentes
- ✅ **Rate limiting inteligente** e proteção anti-abuse
- ✅ **Design system moderno** e responsivo
- ✅ **Deploy simplificado** para Railway/Vercel

---

## ✨ **Principais Funcionalidades**

### 🎨 **Gestão de Agência**
- **Multi-tenancy completo**: Isolamento perfeito entre agências
- **Controle de usuários**: Roles (Owner, Admin, Member) com permissões específicas
- **Planos flexíveis**: FREE (3 clientes, 5 projetos) e PRO (ilimitado)
- **Dashboard intuitivo**: Métricas em tempo real e KPIs

### 🤖 **Inteligência Artificial**
- **31 Agentes especializados**: Meta Ads, Instagram, YouTube, Blog/SEO, WhatsApp
- **Modelos mais recentes**: GPT-4o, GPT-4o Mini, ChatGPT-4o Latest
- **Interface ChatGPT**: Acesso direto aos modelos OpenAI
- **Geração de ebooks**: Sistema completo com 3 etapas automatizadas
- **Rate limiting**: Controle de uso por plano (FREE: 20/mês, PRO: 500/mês)

### 📋 **Gestão de Projetos**
- **Kanban avançado**: Boards customizáveis com drag & drop
- **Gestão de tarefas**: Prioridades, prazos, atribuições
- **Multi-projeto**: Kanban separado para cada projeto
- **Atualizações em tempo real**: Colaboração simultânea da equipe

### 💰 **Controle Financeiro**
- **Receitas e despesas**: Controle completo com categorização
- **Vinculação**: Receitas associadas a clientes/projetos específicos
- **Relatórios**: Análises de performance e tendências
- **Dashboard financeiro**: Métricas visuais e projeções

### 👥 **Gestão de Clientes**
- **Base de clientes**: Dados completos e histórico
- **Projetos vinculados**: Visualização de todos os projetos por cliente
- **Receitas por cliente**: Análise de valor gerado
- **Relacionamento**: Histórico de interações

---

## 🔥 **Features Implementadas**

### 📊 **Dashboard e Analytics**
- **Dashboard Principal**: Visão geral com métricas da agência em tempo real
- **Cards de Estatísticas**: Projetos ativos, tarefas pendentes, receitas do mês
- **Projetos Recentes**: Lista dos últimos projetos com status e progresso
- **Tarefas Pendentes**: To-do list priorizada com prazos e responsáveis
- **Performance Tracking**: KPIs de produtividade da equipe
- **Métricas Visuais**: Gráficos e indicadores de performance

### 👥 **Gestão de Usuários e Permissões**
- **Sistema de Roles**: Owner, Admin, Member com permissões específicas
- **Convite de Usuários**: Sistema de convites por email com roles definidos
- **Perfil de Usuário**: Edição de dados pessoais e configurações
- **Controle de Acesso**: Proteção de rotas baseada em roles
- **Sessões Seguras**: Gerenciamento de sessões com JWT
- **Multi-tenant**: Isolamento completo entre agências

### 👔 **Gestão de Clientes**
- **CRUD Completo**: Criar, editar, visualizar e deletar clientes
- **Dados Completos**: Nome, empresa, email, telefone, endereço
- **Busca e Filtros**: Localização rápida de clientes
- **Histórico de Projetos**: Visualização de todos os projetos por cliente
- **Receitas por Cliente**: Análise de valor gerado por cliente
- **Relacionamento**: Histórico de interações e comunicações
- **Validação de Dados**: Campos obrigatórios e formatos corretos

### 📋 **Gestão de Projetos**
- **CRUD de Projetos**: Criação e gestão completa de projetos
- **Vinculação a Clientes**: Projetos sempre associados a clientes
- **Status Dinâmicos**: Planejamento, Em Andamento, Revisão, Concluído, Cancelado
- **Controle Orçamentário**: Budget por projeto com tracking de gastos
- **Datas de Projeto**: Início e fim com controle de prazos
- **Equipe do Projeto**: Atribuição de usuários aos projetos
- **Progresso Visual**: Indicadores de completude e progresso

### 📋 **Sistema Kanban Avançado**
- **Boards Customizáveis**: Criação de colunas personalizadas por projeto
- **Drag & Drop**: Movimentação intuitiva de tarefas entre colunas
- **Cards de Tarefas**: Informações completas (título, descrição, prazo, responsável)
- **Prioridades**: Baixa, Média, Alta, Urgente com cores distintas
- **Atribuição de Tarefas**: Designação de responsáveis por tarefa
- **Controle de Posição**: Ordenação manual de tarefas e boards
- **Multi-projeto**: Kanban separado e independente para cada projeto
- **Real-time**: Atualizações em tempo real para colaboração da equipe

### 💰 **Sistema Financeiro Completo**
- **Gestão de Receitas**: CRUD completo com categorização
- **Receitas Recorrentes**: Marcação de receitas que se repetem
- **Vinculação**: Receitas associadas a clientes e projetos específicos
- **Gestão de Despesas**: Controle completo de gastos da agência
- **Categorização**: Organização por categorias personalizáveis
- **Dashboard Financeiro**: Métricas visuais e KPIs financeiros
- **Relatórios**: Análises de performance, tendências e projeções
- **Cálculo de Lucro**: Receitas vs despesas com margem de lucro
- **Análise Temporal**: Comparações mês a mês e ano a ano

### 🤖 **Inteligência Artificial - 31 Agentes**
- **Meta Ads & Facebook**: 4 agentes especializados em anúncios pagos
- **Instagram**: 8 agentes para conteúdo orgânico e pago
- **YouTube**: 5 agentes para criação e otimização de vídeos
- **Blog & SEO**: 8 agentes para conteúdo escrito e otimização
- **WhatsApp Business**: 6 agentes para comunicação e vendas
- **Rate Limiting**: Controle de uso por plano (FREE: 20/mês, PRO: 500/mês)
- **Tracking de Uso**: Monitoramento de tokens e custos por agência
- **Histórico de Gerações**: Registro de todas as criações de IA

### 💬 **Interface ChatGPT Integrada**
- **Modelos 2025**: GPT-4o, GPT-4o Mini, ChatGPT-4o Latest, GPT-4 Turbo
- **Seletor de Modelos**: Troca dinâmica entre modelos disponíveis
- **Estatísticas**: Contagem de mensagens e tokens utilizados
- **Histórico Persistente**: Conversas salvas por sessão
- **Export de Conversas**: Download de conversas em formato JSON
- **Interface Nativa**: Design similar ao ChatGPT oficial
- **Rate Limiting**: Controle de uso integrado aos planos

### 📚 **Sistema de Geração de Ebooks**
- **Geração em 3 Etapas**: Descrição → Conteúdo → PDF
- **Sistema de Filas**: Processamento em background com BullMQ + Redis
- **Progress Tracking**: Acompanhamento em tempo real do progresso
- **Aprovação de Etapas**: Cliente pode aprovar antes da próxima etapa
- **Personalização**: Público-alvo, indústria, tom de voz, número de capítulos
- **Templates Profissionais**: Design moderno e responsivo para PDFs
- **Download Automático**: PDF disponível após conclusão
- **Metadata**: Informações completas sobre o ebook gerado
- **Histórico**: Lista de todos os ebooks criados pela agência

### 🔄 **Sistema de Filas e Background Jobs**
- **Redis + BullMQ**: Sistema robusto de filas para operações pesadas
- **Worker Dedicado**: Processamento em background separado do web server
- **Job Monitoring**: Acompanhamento em tempo real de jobs
- **Error Handling**: Retry automático em caso de falhas
- **Concorrência**: Controle de jobs simultâneos (máximo 2)
- **Queue Management**: Limpeza automática de jobs completados
- **Status Tracking**: Estados: queued, active, completed, failed
- **Progress Updates**: Polling automático de status a cada 2 segundos

### 🔐 **Autenticação e Segurança**
- **NextAuth.js v5**: Sistema de autenticação robusto
- **Login com Credenciais**: Email e senha com hash bcrypt
- **Sessões JWT**: Tokens seguros com informações da agência
- **Middleware de Proteção**: Rotas protegidas automaticamente
- **Multi-tenant Security**: Isolamento perfeito entre agências
- **Rate Limiting**: Proteção contra abuse em múltiplas camadas
- **CSRF Protection**: Proteção contra ataques cross-site
- **Input Validation**: Validação rigorosa com Zod schemas

### 📱 **Interface e UX/UI**
- **Design System**: Shadcn/ui + Radix UI primitives
- **Responsive Design**: Mobile-first com Tailwind CSS
- **Loading States**: Skeleton loaders e spinners em todas as operações
- **Error Boundaries**: Tratamento elegante de erros em componentes
- **Toast Notifications**: Feedback visual para todas as ações
- **Sidebar Dinâmica**: Navegação com badges e indicadores
- **Modal Dialogs**: Criação e edição em modais responsivos
- **Form Validation**: Validação em tempo real com React Hook Form

### 📊 **Relatórios e Analytics**
- **Dashboard Financeiro**: Visão completa da saúde financeira
- **Análise de Clientes**: Performance e valor gerado por cliente
- **Relatórios de Projeto**: Status e progresso de todos os projetos
- **Usage Analytics**: Uso dos agentes de IA por período
- **Tendências**: Gráficos de crescimento e performance
- **Exportação**: Relatórios em formatos diversos
- **Comparações Temporais**: Análises mês a mês e ano a ano

### 🔧 **Funcionalidades Técnicas**
- **API RESTful**: Endpoints bem estruturados e documentados
- **Server Actions**: Next.js 14 Server Actions para mutations
- **Database Optimization**: Índices estratégicos e queries otimizadas
- **Caching Strategy**: Cache inteligente com React Query
- **Error Logging**: Sistema estruturado de logs e monitoramento
- **Performance Monitoring**: Web Vitals e métricas de performance
- **Backup System**: Estratégias de backup e recovery
- **Environment Config**: Configuração flexível por ambiente

### 🚀 **Deploy e DevOps**
- **Railway Ready**: Configuração completa para deploy automático
- **Worker Configuration**: Setup separado para background jobs
- **Environment Variables**: Gestão segura de configurações
- **Database Migrations**: Prisma migrations automáticas
- **Health Checks**: Monitoramento de saúde dos serviços
- **Scaling**: Preparado para escalar horizontalmente
- **Docker Support**: Containerização completa opcional
- **CI/CD Ready**: Preparado para pipelines de deploy

### 🔍 **Funcionalidades de Busca e Filtros**
- **Busca Global**: Pesquisa em clientes, projetos e tarefas
- **Filtros Avançados**: Múltiplos critérios de filtragem
- **Ordenação**: Ordenação por diferentes campos
- **Paginação**: Performance otimizada para grandes volumes
- **Busca Full-text**: Pesquisa inteligente em conteúdo
- **Filtros Salvos**: Salvamento de filtros frequentes
- **Busca por Período**: Filtros temporais específicos

### ⚙️ **Configurações do Sistema**
- **Configurações da Agência**: Settings personalizáveis por agência
- **Preferências de Usuário**: Configurações individuais
- **Configuração de IA**: Ajuste de parâmetros dos modelos
- **Rate Limiting Config**: Controle de limites por plano
- **Notifications**: Sistema de notificações configurável
- **Theme Settings**: Personalização visual (preparado)
- **API Configuration**: Configuração de integrações externas

### 📧 **Sistema de Notificações**
- **Toast Notifications**: Feedback imediato para ações
- **Error Notifications**: Alertas de erro com detalhes
- **Success Messages**: Confirmações de ações bem-sucedidas
- **Progress Notifications**: Updates de progresso em operações longas
- **System Alerts**: Notificações do sistema sobre limites e status
- **Real-time Updates**: Notificações em tempo real (preparado)

### 🔄 **Integrações**
- **OpenAI API**: Integração completa com modelos GPT
- **Redis Integration**: Cache e filas com Redis/Upstash
- **Database**: PostgreSQL com Prisma ORM
- **File Storage**: Sistema de arquivos para uploads
- **PDF Generation**: Puppeteer para geração de documentos
- **Email Ready**: Preparado para integração de email
- **Webhook Support**: Sistema de webhooks (preparado)

---

## 🤖 **31 Agentes de IA Especializados**

### 📱 **Meta Ads & Instagram (12 Agentes)**

| Agente | Funcionalidade | Especialização |
|--------|----------------|----------------|
| **Persona Generator** | Criação de personas detalhadas | Segmentação de público |
| **Copy Generator** | Textos persuasivos para anúncios | Copywriting otimizado |
| **A/B Testing** | Estratégias de testes | Otimização de campanhas |
| **Audience Segmentation** | Segmentação avançada | Targeting preciso |
| **Instagram Caption** | Legendas engajadoras | Aumento de engajamento |
| **Instagram Hashtags** | Hashtags estratégicas | Alcance orgânico |
| **Instagram Post Ideas** | Ideias de conteúdo | Criatividade e trends |
| **Instagram Carousel Text** | Textos para carrosséis | Storytelling visual |
| **Instagram Generator** | Conteúdo completo | Posts com imagem + texto |
| **Instagram Backgrounds** | Backgrounds com IA | Design automatizado |
| **Instagram Content** | Criação de conteúdo | Produção em escala |
| **Instagram Assistants** | Hub de assistentes | Central de ferramentas |

### 📺 **YouTube & Video (5 Agentes)**

| Agente | Funcionalidade | Especialização |
|--------|----------------|----------------|
| **YouTube Script** | Scripts profissionais | Roteiros engajadores |
| **YouTube SEO** | Otimização para buscas | Ranking no YouTube |
| **YouTube Content Planner** | Planejamento estratégico | Calendário editorial |
| **YouTube Optimization** | Otimização de performance | Métricas e analytics |
| **YouTube Assistants** | Hub de assistentes | Ferramentas centralizadas |

### 📝 **Blog & SEO (8 Agentes)**

| Agente | Funcionalidade | Especialização |
|--------|----------------|----------------|
| **Blog Complete Writer** | Artigos completos | Redação profissional |
| **Blog Ideas Generator** | Ideias de conteúdo | Brainstorming automatizado |
| **Blog Structure** | Estruturas otimizadas | Organização de conteúdo |
| **Blog Paragraph** | Parágrafos específicos | Desenvolvimento de tópicos |
| **Blog Meta Generator** | Meta tags e descrições | SEO técnico |
| **Blog SEO Optimizer** | Otimização SEO avançada | Ranking no Google |
| **Blog FAQ Generator** | Seções de FAQ | Resposta a dúvidas |
| **Blog Update Analyzer** | Análise de atualizações | Manutenção de conteúdo |

### 📱 **WhatsApp Business (6 Agentes)**

| Agente | Funcionalidade | Especialização |
|--------|----------------|----------------|
| **WhatsApp Sales Script** | Scripts de vendas | Conversão otimizada |
| **WhatsApp Support** | Templates de suporte | Atendimento eficiente |
| **WhatsApp Broadcast** | Mensagens em massa | Campanhas automáticas |
| **WhatsApp Templates** | Templates diversos | Comunicação padronizada |
| **WhatsApp Audio Script** | Scripts para áudios | Comunicação por voz |
| **WhatsApp Followup** | Follow-up automatizado | Nutrição de leads |

---

## 🏗️ **Arquitetura**

### **Stack Tecnológico**

```mermaid
graph TB
    A[Frontend - Next.js 14] --> B[API Routes]
    B --> C[Server Actions]
    C --> D[Prisma ORM]
    D --> E[PostgreSQL]
    
    B --> F[Redis + BullMQ]
    F --> G[Background Workers]
    
    B --> H[OpenAI API]
    H --> I[GPT-4o Models]
    
    A --> J[Shadcn/UI + Tailwind]
    J --> K[Responsive Design]
```

### **Tecnologias Principais**

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **Frontend** | Next.js | 15.3.3 | Framework React com App Router |
| **Backend** | Next.js API | 15.3.3 | Server Actions + API Routes |
| **Database** | PostgreSQL | Latest | Banco relacional robusto |
| **ORM** | Prisma | 6.9.0 | Type-safe database client |
| **Authentication** | NextAuth.js | 5.0 Beta | Autenticação completa |
| **AI/ML** | OpenAI | 5.1.1 | Modelos GPT mais recentes |
| **Queue** | BullMQ | 5.54.2 | Sistema de filas Redis |
| **Cache** | Redis | IORedis 5.6.1 | Cache e rate limiting |
| **UI/UX** | Shadcn/UI | Latest | Componentes modernos |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Drag & Drop** | @dnd-kit | 6.3.1 | Kanban interativo |
| **PDF Generation** | Puppeteer | 24.10.1 | Geração de PDFs |
| **Validation** | Zod | 3.25.53 | Schema validation |
| **State Management** | React Query | 5.59.0 | Estado do cliente |

### **Arquitetura Multi-tenant**

```typescript
// Isolamento automático por agencyId
const projects = await db.project.findMany({
  where: { agencyId: session.user.agencyId },
  include: { client: true }
})

// Todas as mutations incluem agencyId
const newClient = await db.client.create({
  data: {
    ...clientData,
    agencyId: session.user.agencyId
  }
})
```

---

## 🚀 **Instalação**

### **Pré-requisitos**

- Node.js 18+ (recomendado: 20+)
- PostgreSQL 14+
- Redis 6+ (para filas)
- Git

### **Instalação Rápida**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/agenciaos.git
cd agenciaos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Configure o banco de dados
npm run db:push

# 5. Inicie o servidor de desenvolvimento
npm run dev

# 6. (Opcional) Inicie o worker para filas
npm run worker
```

### **Instalação Detalhada**

#### **1. Configuração do Banco de Dados**

```bash
# PostgreSQL local
createdb agenciaos

# Ou use um serviço como Neon, Supabase, Railway
DATABASE_URL="postgresql://user:password@localhost:5432/agenciaos"
```

#### **2. Configuração do Redis**

```bash
# Redis local
redis-server

# Ou use Upstash, Railway Redis
REDIS_URL="redis://localhost:6379"
```

#### **3. Variáveis de Ambiente Obrigatórias**

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-sua-chave-openai-aqui"

# Redis (para filas)
REDIS_URL="redis://localhost:6379"

# Node Environment
NODE_ENV="development"
```

#### **4. Inicialização do Banco**

```bash
# Gerar o client Prisma
npm run db:generate

# Aplicar o schema ao banco
npm run db:push

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

#### **5. Seed de Dados (Opcional)**

```bash
# Criar usuário de teste
node seed-test-user.js

# Testar conexão com banco
node test-db.js
```

---

## ⚙️ **Configuração**

### **Configuração de Produção**

#### **Railway Deploy**

```bash
# 1. Login no Railway
railway login

# 2. Criar projeto
railway init

# 3. Adicionar Redis e PostgreSQL
railway add -d redis
railway add -d postgresql

# 4. Configurar variáveis
railway variables set NEXTAUTH_SECRET="$(openssl rand -base64 32)"
railway variables set NODE_ENV="production"
railway variables set OPENAI_API_KEY="sua-chave-aqui"

# 5. Deploy
railway up

# 6. Configurar worker no dashboard Railway
# Start Command: npm run worker
```

#### **Vercel Deploy**

```bash
# 1. Deploy no Vercel
npx vercel

# 2. Configurar variáveis no dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - OPENAI_API_KEY
# - REDIS_URL

# 3. Para workers, use Railway/Render separadamente
```

### **Configuração de Modelos OpenAI**

```typescript
// src/lib/chatgpt-config.ts
export const CHATGPT_MODELS = {
  'gpt-4o': {
    name: 'GPT-4o',
    description: 'Mais avançado, multimodal',
    contextLength: 128000,
    pricing: { input: 2.50, output: 10.00 }
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'Rápido e econômico',
    contextLength: 128000,
    pricing: { input: 0.15, output: 0.60 }
  },
  // ... outros modelos
}
```

### **Configuração de Rate Limiting**

```typescript
// Por plano
FREE: 20 gerações/mês
PRO: 500 gerações/mês

// Por IP
100 requests/10 minutos

// Por usuário
50 requests/minuto
```

---

## 📖 **Guia de Uso**

### **1. Primeira Configuração**

#### **Criar Agência**
```bash
# 1. Acesse http://localhost:3000
# 2. Clique em "Registrar"
# 3. Preencha os dados da agência
# 4. Confirme o email (se configurado)
```

#### **Convite de Usuários**
- Acesse **Configurações > Usuários**
- Clique em **"Convidar Usuário"**
- Defina o **role**: Admin ou Member
- Envie o link de convite

### **2. Gestão de Clientes**

```typescript
// Criar cliente
const client = {
  name: "Empresa XYZ",
  email: "contato@xyz.com",
  phone: "+55 11 99999-9999",
  company: "XYZ Ltda",
  address: {
    street: "Rua ABC, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567"
  }
}
```

### **3. Gestão de Projetos**

#### **Criar Projeto**
- **Nome**: Nome do projeto
- **Cliente**: Selecione o cliente
- **Budget**: Valor orçado
- **Datas**: Início e fim previsto
- **Status**: Planejamento, Em Andamento, Revisão, Concluído

#### **Configurar Kanban**
```typescript
// Boards padrão
const defaultBoards = [
  { name: "Backlog", position: 0, color: "#gray" },
  { name: "Em Andamento", position: 1, color: "#blue" },
  { name: "Revisão", position: 2, color: "#yellow" },
  { name: "Concluído", position: 3, color: "#green" }
]
```

### **4. Uso dos Agentes de IA**

#### **Geração de Conteúdo Instagram**
```typescript
// Exemplo: Instagram Caption Generator
const prompt = {
  product: "Curso de Marketing Digital",
  targetAudience: "Empreendedores iniciantes",
  tone: "Educativo e motivacional",
  cta: "Link na bio"
}

// Resultado: 3 opções de legendas + hashtags
```

#### **Geração de Ebooks**
```typescript
// 1. Descrição (IA gera estrutura)
const ebookRequest = {
  topic: "Marketing Digital para Pequenas Empresas",
  targetAudience: "Donos de pequenos negócios",
  chapters: 10,
  pagesPerChapter: 5
}

// 2. Conteúdo (IA gera todos os capítulos)
// 3. PDF (Puppeteer gera arquivo final)
```

### **5. Sistema Financeiro**

#### **Registrar Receitas**
```typescript
const revenue = {
  description: "Gestão de Redes Sociais - Janeiro",
  amount: 2500.00,
  category: "Serviços Recorrentes",
  isRecurring: true,
  clientId: "client_id",
  projectId: "project_id",
  date: new Date()
}
```

#### **Registrar Despesas**
```typescript
const expense = {
  description: "Facebook Ads - Cliente XYZ",
  amount: 500.00,
  category: "Mídia Paga",
  date: new Date()
}
```

---

## 🔧 **API Reference**

### **Autenticação**

#### **Registrar Agência**
```typescript
POST /api/auth/register
{
  "name": "Agência ABC",
  "slug": "agencia-abc",
  "email": "owner@agencia.com",
  "password": "senha123",
  "ownerName": "João Silva"
}
```

#### **Login**
```typescript
POST /api/auth/signin
{
  "email": "owner@agencia.com",
  "password": "senha123"
}
```

### **Clientes**

#### **Listar Clientes**
```typescript
GET /api/clients
// Retorna clientes da agência do usuário logado

Response: {
  "clients": [
    {
      "id": "client_id",
      "name": "Cliente ABC",
      "email": "contato@cliente.com",
      "projectsCount": 3,
      "totalRevenue": 15000.00
    }
  ]
}
```

#### **Criar Cliente**
```typescript
POST /api/clients
{
  "name": "Novo Cliente",
  "email": "novo@cliente.com",
  "phone": "+55 11 99999-9999",
  "company": "Empresa Ltda"
}
```

### **Projetos**

#### **Listar Projetos**
```typescript
GET /api/projects?clientId=optional

Response: {
  "projects": [
    {
      "id": "project_id",
      "name": "Campanha Digital",
      "client": { "name": "Cliente ABC" },
      "status": "IN_PROGRESS",
      "budget": 10000.00,
      "tasksCount": 15,
      "completedTasks": 8
    }
  ]
}
```

### **Agentes de IA**

#### **Instagram Caption Generator**
```typescript
POST /api/ai/instagram-caption
{
  "product": "Produto/Serviço",
  "targetAudience": "Público-alvo",
  "tone": "Tom de voz",
  "specificDetails": "Detalhes específicos"
}

Response: {
  "captions": [
    {
      "text": "Legenda gerada...",
      "hashtags": ["#marketing", "#digital"]
    }
  ],
  "tokensUsed": 150
}
```

#### **Blog Complete Writer**
```typescript
POST /api/ai/blog-complete
{
  "topic": "Tópico do artigo",
  "targetAudience": "Público-alvo",
  "tone": "Tom de voz",
  "wordCount": 1000,
  "includeMetaTags": true
}

Response: {
  "article": {
    "title": "Título gerado",
    "content": "Conteúdo completo...",
    "metaTitle": "Meta título",
    "metaDescription": "Meta descrição",
    "tags": ["tag1", "tag2"]
  },
  "tokensUsed": 800
}
```

### **Ebooks**

#### **Iniciar Geração de Ebook**
```typescript
POST /api/ebook/queue/description
{
  "title": "Título do Ebook",
  "targetAudience": "Público-alvo",
  "industry": "Indústria/Setor",
  "pages": 50,
  "chapters": 10
}

Response: {
  "jobId": "job_12345",
  "status": "queued",
  "estimatedTime": "2-3 minutos"
}
```

#### **Verificar Status**
```typescript
GET /api/ebook/queue/status/job_12345

Response: {
  "job": {
    "id": "job_12345",
    "status": "completed", // queued, active, completed, failed
    "progress": 100,
    "data": {
      "description": "...",
      "content": "...",
      "pdfUrl": "/uploads/ebooks/ebook_12345.pdf"
    },
    "error": null
  }
}
```

### **Sistema Financeiro**

#### **Dashboard Financeiro**
```typescript
GET /api/financial/stats?period=month

Response: {
  "totalRevenue": 25000.00,
  "totalExpenses": 8000.00,
  "profit": 17000.00,
  "profitMargin": 68.0,
  "revenueGrowth": 15.5,
  "topClients": [
    {
      "name": "Cliente ABC",
      "revenue": 10000.00,
      "percentage": 40.0
    }
  ],
  "monthlyData": [
    { "month": "Jan", "revenue": 20000, "expenses": 6000 },
    { "month": "Fev", "revenue": 25000, "expenses": 8000 }
  ]
}
```

---

## 📊 **Banco de Dados**

### **Schema Principal**

```mermaid
erDiagram
    Agency ||--o{ User : "has members"
    Agency ||--o{ Client : "manages"
    Agency ||--o{ Project : "owns"
    Agency ||--o{ Revenue : "tracks"
    Agency ||--o{ Expense : "tracks"
    Agency ||--o{ AIUsage : "monitors"
    Agency ||--o{ Ebook : "generates"
    
    Client ||--o{ Project : "has"
    Client ||--o{ Revenue : "generates"
    
    Project ||--o{ Board : "contains"
    Project ||--o{ Task : "includes"
    Project ||--o{ Revenue : "generates"
    
    Board ||--o{ Task : "organizes"
    User ||--o{ Task : "assigned to"
    
    Agency {
        string id PK
        string name
        string slug UK
        string ownerId UK
        json settings
        enum plan
        datetime createdAt
        datetime updatedAt
    }
    
    User {
        string id PK
        string email UK
        string name
        string password
        enum role
        string agencyId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Client {
        string id PK
        string agencyId FK
        string name
        string email
        string phone
        string company
        json address
        datetime createdAt
        datetime updatedAt
    }
    
    Project {
        string id PK
        string agencyId FK
        string clientId FK
        string name
        string description
        enum status
        decimal budget
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }
    
    Board {
        string id PK
        string projectId FK
        string name
        int position
        string color
        datetime createdAt
        datetime updatedAt
    }
    
    Task {
        string id PK
        string projectId FK
        string boardId FK
        string assignedTo FK
        string title
        string description
        enum priority
        datetime dueDate
        int position
        datetime createdAt
        datetime updatedAt
    }
    
    Revenue {
        string id PK
        string agencyId FK
        string clientId FK
        string projectId FK
        string description
        decimal amount
        string category
        boolean isRecurring
        datetime date
        datetime createdAt
        datetime updatedAt
    }
    
    Expense {
        string id PK
        string agencyId FK
        string description
        decimal amount
        string category
        datetime date
        datetime createdAt
        datetime updatedAt
    }
    
    AIUsage {
        string id PK
        string agencyId FK
        string agentType
        int tokensUsed
        decimal cost
        datetime createdAt
    }
    
    Ebook {
        string id PK
        string agencyId FK
        string title
        text description
        text content
        enum status
        string pdfUrl
        text metadata
        datetime createdAt
        datetime updatedAt
    }
```

### **Índices de Performance**

```sql
-- Índices multi-tenant
CREATE INDEX idx_clients_agency ON clients(agencyId);
CREATE INDEX idx_projects_agency ON projects(agencyId);
CREATE INDEX idx_tasks_project ON tasks(projectId);
CREATE INDEX idx_revenues_agency_date ON revenues(agencyId, date DESC);
CREATE INDEX idx_expenses_agency_date ON expenses(agencyId, date DESC);
CREATE INDEX idx_ai_usage_agency_date ON ai_usage(agencyId, createdAt DESC);

-- Índices de busca
CREATE INDEX idx_clients_name ON clients USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_projects_name ON projects USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_tasks_title ON tasks USING gin(to_tsvector('portuguese', title));
```

### **Backup e Migração**

```bash
# Backup do banco
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
psql $DATABASE_URL < backup_20240617_142030.sql

# Migração Prisma
npx prisma migrate dev --name nome_da_migracao

# Reset completo (CUIDADO!)
npx prisma migrate reset
```

---

## 🛡️ **Segurança**

### **Multi-tenant Security**

#### **Isolamento de Dados**
```typescript
// SEMPRE filtrar por agencyId
const projects = await db.project.findMany({
  where: { 
    agencyId: session.user.agencyId, // Obrigatório
    status: "IN_PROGRESS" 
  }
})

// SEMPRE incluir agencyId em mutations
const newTask = await db.task.create({
  data: {
    ...taskData,
    projectId,
    boardId,
    // agencyId vem do projeto (garantido pelo Prisma)
  }
})
```

#### **Middleware de Proteção**
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Proteger rotas do dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token?.agencyId) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}
```

### **Rate Limiting**

#### **Configuração Multi-layer**
```typescript
// Por IP
const ipLimiter = new Ratelimit({
  redis: upstashRedis,
  limiter: Ratelimit.slidingWindow(100, "10 m"),
})

// Por usuário
const userLimiter = new Ratelimit({
  redis: upstashRedis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
})

// Por agência (IA)
const aiLimiter = new Ratelimit({
  redis: upstashRedis,
  limiter: Ratelimit.slidingWindow(500, "30 d"), // PRO
})
```

### **Validação de Entrada**

#### **Schemas Zod**
```typescript
// src/lib/validations/clients.ts
export const createClientSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  company: z.string().max(100).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
})
```

### **Proteção de APIs**

#### **Server Actions Seguras**
```typescript
"use server"
import { createSafeActionClient } from 'next-safe-action'

const actionClient = createSafeActionClient()

export const createProject = actionClient
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth()
    if (!session?.user.agencyId) {
      throw new Error("Não autorizado")
    }

    // Validar se cliente pertence à agência
    const client = await db.client.findFirst({
      where: { 
        id: parsedInput.clientId, 
        agencyId: session.user.agencyId 
      }
    })

    if (!client) {
      throw new Error("Cliente não encontrado")
    }

    return db.project.create({
      data: {
        ...parsedInput,
        agencyId: session.user.agencyId
      }
    })
  })
```

---

## 📈 **Performance**

### **Otimizações Implementadas**

#### **Database**
- **Índices estratégicos** para queries multi-tenant
- **Connection pooling** com Prisma
- **Query optimization** com includes seletivos
- **Pagination** em todas as listas

#### **Frontend**
- **Server Components** por padrão
- **Lazy loading** para componentes pesados
- **React Query** para cache inteligente
- **Memoização** em componentes críticos

#### **Background Jobs**
```typescript
// Sistema de filas para operações pesadas
const ebookQueue = new Queue('ebook-generation', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  }
})

// Worker com concorrência controlada
const worker = new Worker('ebook-generation', processor, {
  connection: redis,
  concurrency: 2, // Máximo 2 jobs simultâneos
})
```

### **Monitoramento**

#### **Métricas de Performance**
```typescript
// Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- FID (First Input Delay): < 100ms
- Bundle Size: < 500KB inicial
- API Response Time: < 200ms média
```

#### **Logs Estruturados**
```typescript
// src/lib/monitoring.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      agencyId: meta?.agencyId,
      userId: meta?.userId,
      ...meta
    }))
  },
  
  error: (error: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }))
  }
}
```

---

## 🚀 **Deploy**

### **Railway (Recomendado)**

#### **Deploy Automático**
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Adicionar Redis e PostgreSQL
railway add -d redis
railway add -d postgresql

# 5. Configurar variáveis
railway variables set NEXTAUTH_SECRET="$(openssl rand -base64 32)"
railway variables set NODE_ENV="production"
railway variables set OPENAI_API_KEY="sua-chave-aqui"

# 6. Deploy
railway up
```

#### **Configurar Worker**
1. Acesse [railway.app](https://railway.app)
2. Vá para seu projeto
3. Clique em **"New Service"**
4. Selecione **"GitHub Repo"**
5. Configure:
   - **Start Command**: `npm run worker`
   - **Environment Variables**: Copie do serviço web

### **Vercel + Railway Workers**

#### **Deploy Web (Vercel)**
```bash
# 1. Deploy no Vercel
npx vercel

# 2. Configurar variáveis no dashboard:
# - DATABASE_URL (Railway PostgreSQL)
# - NEXTAUTH_SECRET
# - OPENAI_API_KEY
# - REDIS_URL (Railway Redis)
```

#### **Deploy Workers (Railway)**
```bash
# 1. Criar projeto apenas para workers
railway init worker-agenciaos

# 2. Configurar start command: npm run worker
railway variables set REDIS_URL="sua-redis-url-aqui"
railway variables set DATABASE_URL="sua-database-url-aqui"

# 3. Deploy
railway up
```

### **Docker (Avançado)**

#### **Dockerfile**
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### **Docker Compose**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/agenciaos
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=your-secret
      - OPENAI_API_KEY=your-key
    depends_on:
      - db
      - redis

  worker:
    build: .
    command: npm run worker
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/agenciaos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=agenciaos
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

### **Variáveis de Ambiente Produção**

```env
# Obrigatórias
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="chave-secreta-32-chars-minimo"
NEXTAUTH_URL="https://seu-dominio.com"
OPENAI_API_KEY="sk-sua-chave-openai"
REDIS_URL="redis://host:6379"
NODE_ENV="production"

# Opcionais
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
TRIGGER_API_KEY="tr_..."  # Se usar Trigger.dev
```

---

## 🤝 **Contribuindo**

### **Como Contribuir**

1. **Fork** o repositório
2. **Clone** o fork
3. **Crie** uma branch para sua feature
4. **Implemente** a funcionalidade
5. **Teste** thoroughly
6. **Commit** com mensagem descritiva
7. **Push** para sua branch
8. **Abra** um Pull Request

### **Padrões de Código**

#### **Commit Messages**
```bash
feat(component): add new component
fix(api): fix api error  
docs(readme): update readme
refactor(utils): refactor utils
style(tailwind): add new tailwind class
test(unit): add unit test
chore(deps): update dependencies
```

#### **Branch Naming**
```bash
feature/nome-da-feature
bugfix/descrição-do-bug
hotfix/correção-urgente
docs/atualização-documentação
```

#### **Code Style**
- **TypeScript strict mode** habilitado
- **ESLint** para linting
- **Prettier** para formatação
- **Zod** para validação
- **Conventional commits**

### **Estrutura de Contribuição**

```typescript
// 1. SEMPRE ler arquivos existentes antes de criar
// 2. SEMPRE seguir padrões existentes
// 3. SEMPRE validar multi-tenancy
// 4. SEMPRE usar tecnologias do stack
// 5. SEMPRE otimizar para performance
```

### **Roadmap**

#### **Próximas Features (Q2 2024)**
- [ ] **WhatsApp Business API** integration
- [ ] **Email marketing** automation
- [ ] **Advanced analytics** dashboard  
- [ ] **Mobile app** (React Native)
- [ ] **API pública** para integrações
- [ ] **Webhooks** system
- [ ] **Multi-idioma** support
- [ ] **White-label** options

#### **Melhorias Técnicas**
- [ ] **Real-time updates** com WebSockets
- [ ] **Advanced caching** strategy
- [ ] **GraphQL API** optional
- [ ] **Microservices** architecture
- [ ] **E2E testing** suite
- [ ] **CI/CD** pipelines
- [ ] **Monitoring** avançado
- [ ] **A/B testing** framework

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 **Suporte**

### **Documentação**
- 📚 [Documentação Completa](https://docs.agenciaos.com)
- 🎥 [Video Tutoriais](https://youtube.com/agenciaos)
- 💬 [Discord Community](https://discord.gg/agenciaos)

### **Contato**
- 📧 **Email**: suporte@agenciaos.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/agenciaos/agenciaos/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/agenciaos/agenciaos/discussions)

### **Status**
- 🚀 **Versão**: 0.1.0 (Beta)
- 📈 **Uptime**: 99.9%
- 🔄 **Última atualização**: Junho 2024

---

<div align="center">

### 🌟 **Feito com ❤️ para Agências de Marketing Digital**

**[⭐ Star no GitHub](https://github.com/agenciaos/agenciaos)** • **[🐦 Follow no Twitter](https://twitter.com/agenciaos)** • **[📧 Newsletter](https://agenciaos.com/newsletter)**

</div>

---

## 📊 **Stats do Projeto**

![GitHub stars](https://img.shields.io/github/stars/agenciaos/agenciaos.svg?style=social)
![GitHub forks](https://img.shields.io/github/forks/agenciaos/agenciaos.svg?style=social)
![GitHub issues](https://img.shields.io/github/issues/agenciaos/agenciaos.svg)
![GitHub license](https://img.shields.io/github/license/agenciaos/agenciaos.svg)
![Lines of code](https://img.shields.io/tokei/lines/github/agenciaos/agenciaos.svg)

**AgênciaOS** - Transformando a gestão de agências de marketing digital com tecnologia de ponta e IA avançada.