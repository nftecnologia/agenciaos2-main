# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgênciaOS is a comprehensive SaaS platform for digital marketing agencies built with Next.js 14. It features multi-tenant architecture, 31 specialized AI agents, project management with Kanban boards, financial tracking, and social media management tools.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version (includes Prisma generate)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio GUI

### Testing & Debugging
- `node test-db.js` - Test database connection
- `node seed-test-user.js` - Seed test user for development

## Architecture

### Multi-tenant Structure
The application follows a strict multi-tenant architecture where all data is isolated by `agencyId`. Every model (except User and auth tables) has an `agencyId` field for tenant isolation.

### Key Technologies
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js v5 with credentials provider
- **AI**: OpenAI GPT-4 integration with 31 specialized agents
- **UI**: Shadcn/ui components with Radix UI primitives
- **Drag & Drop**: @dnd-kit for Kanban boards

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes (multi-tenant aware)
│   └── auth/              # Authentication pages
├── components/            # Reusable React components
│   ├── ui/               # Shadcn UI components
│   ├── kanban/           # Kanban board components
│   └── ia/               # 31 AI agent components
├── lib/                  # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── actions/          # Server actions
└── hooks/                # Custom React hooks
```

### Database Schema
The schema follows multi-tenant patterns with these key models:
- `Agency` - Tenant root with plan (FREE/PRO) and settings
- `User` - With role-based permissions (OWNER/ADMIN/MEMBER)
- `Client` - Agency's clients
- `Project` - Client projects with Kanban boards
- `Board`/`Task` - Kanban system with drag-and-drop
- `Revenue`/`Expense` - Financial tracking
- `AIUsage` - Track AI agent usage for billing

## Authentication & Security

### Multi-tenant Security
- All API routes must validate `agencyId` from session
- Database queries automatically filter by tenant
- Use `lib/tenant.ts` helpers for tenant context
- Row-level security enforced at database level

### Permission System
- **OWNER**: Full access to agency
- **ADMIN**: Manage users and settings
- **MEMBER**: Access assigned projects only

### Session Management
- JWT-based sessions via NextAuth.js
- Session includes `user.agencyId` and `user.role`
- Protected routes check authentication via middleware

## AI Agents System

The platform includes 31 specialized AI agents organized by category:
- **Meta Ads** (5 agents): Persona generation, copy creation, A/B testing
- **Instagram** (7 agents): Captions, hashtags, content ideas, carousels
- **YouTube** (5 agents): Scripts, SEO optimization, content planning
- **Blog/SEO** (6 agents): Article writing, structure, FAQ generation
- **WhatsApp** (4 agents): Sales scripts, templates, support flows
- **CRM** (3 agents): Follow-up templates, satisfaction surveys
- **Instagram Generator** (1 agent): Full post creation with images + text

### AI Implementation Pattern
Each agent follows this structure:
1. Component in `src/components/ia/agents/[agent-name].tsx`
2. API route in `src/app/api/ai/[agent-name]/route.ts`
3. OpenAI integration with usage tracking
4. Plan-based rate limiting (FREE: 20/month, PRO: 500/month)

## Development Guidelines

### Code Conventions
- Use TypeScript with strict mode enabled
- Follow Next.js App Router patterns with Server Components
- Use Prisma for all database operations
- Server Actions for mutations, API routes for external calls
- Tailwind CSS for styling with design system consistency

### Multi-tenant Development
- Always filter queries by `agencyId` from session
- Use `lib/actions/` for server actions with tenant validation
- Test with multiple agencies to ensure proper isolation
- Never expose data across tenants

### Component Architecture
- Server Components by default, Client Components when needed
- Use `"use client"` directive only for interactivity
- Leverage React Query for client-side data fetching
- Form handling with React Hook Form + Zod validation

### Database Operations
- Always use Prisma client from `lib/db.ts`
- Include `agencyId` in all tenant-related queries
- Use Prisma transactions for complex operations
- Run `npm run db:push` after schema changes

## Environment Setup

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Application URL
- `OPENAI_API_KEY` - OpenAI API key for AI agents

## Common Patterns

### Server Action Pattern
```typescript
"use server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createProject(data: CreateProjectData) {
  const session = await auth()
  if (!session?.user.agencyId) throw new Error("Unauthorized")
  
  return db.project.create({
    data: {
      ...data,
      agencyId: session.user.agencyId
    }
  })
}
```

### Component with Tenant Data
```typescript
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function ProjectsList() {
  const session = await auth()
  
  const projects = await db.project.findMany({
    where: { agencyId: session.user.agencyId },
    include: { client: true }
  })
  
  return <ProjectsGrid projects={projects} />
}
```

## Business Logic

### Plan Limitations
- FREE plan: 3 clients, 5 projects, 20 AI generations/month
- PRO plan: Unlimited clients/projects, 500 AI generations/month
- Enforce limits in API routes and UI components

### Financial Module
- Track revenues (recurring/one-time) and expenses by category
- Link revenues to specific clients/projects when applicable
- Generate reports and analytics for agency performance

### Kanban System
- Projects contain multiple Boards (columns)
- Tasks belong to Boards and can be assigned to Users
- Drag-and-drop functionality with position tracking
- Real-time updates across team members

## Regras de Limpeza de Repositório

### 🎯 Objetivo
Manter o repositório limpo, organizado e eficiente, prevenindo conflitos e facilitando a manutenção através de uma análise pós-desenvolvimento automatizada.

### 📋 Procedimento de Limpeza
A limpeza deve ser executada após cada inserção de código bem-sucedida, seguindo uma análise detalhada do repositório.

### 🗑️ Itens para Remoção

#### 1. Arquivos de Teste
- Testes obsoletos ou sem referência ao código atual
- Duplicatas de testes
- Arquivos de teste não utilizados

#### 2. Arquivos Temporários
- Arquivos `.tmp`, `.cache`
- Logs não essenciais
- Arquivos de cache do sistema
- Arquivos temporários do editor

#### 3. Artefatos de Build
- Diretório `dist/`, `build/`, `out/`
- Builds intermediários
- Arquivos gerados automaticamente não versionados

#### 4. Código Legado
- Implementações descontinuadas
- Recursos substituídos por novas versões
- Código comentado obsoleto (mais de 30 dias)
- Componentes não referenciados

#### 5. Componentes Redundantes
- Componentes duplicados
- Versões antigas de componentes substituídas
- Implementações sobrepostas ou conflitantes

#### 6. Configurações
- Arquivos de configuração sem uso
- Configurações obsoletas ou duplicadas
- Settings de desenvolvimento não utilizados

#### 7. Dependências
- Pacotes não utilizados no `package.json`
- Importações sem referência no código
- Módulos abandonados ou deprecados

#### 8. Documentação
- Documentação desatualizada
- Documentação redundante
- Guias obsoletos ou incorretos

### ⚠️ Processo de Verificação

1. **Análise**
   - Executar verificação automatizada dos arquivos
   - Identificar itens candidatos à remoção
   - Usar ferramentas de análise estática

2. **Validação**
   - Verificar essencialidade dos arquivos identificados
   - Criar lista de itens para revisão
   - Documentar justificativas para remoção

3. **Remoção**
   - Executar limpeza após validação
   - Manter backup temporário dos itens removidos
   - Registrar todas as alterações realizadas

4. **Relatório**
   - Listar todos os itens removidos
   - Documentar impactos das remoções
   - Registrar data/hora da limpeza
   - Incluir ferramentas utilizadas no processo

### 🚫 Exceções - NUNCA Remover

- Arquivos essenciais do sistema (`package.json`, `tsconfig.json`, etc.)
- Configurações críticas (database, auth, environment)
- Documentação atual e relevante
- Testes ativos e funcionais
- Arquivos de configuração do projeto
- Dependências necessárias para o funcionamento
- Arquivos relacionados ao multi-tenancy
- Configurações dos 31 agentes de IA

### 👤 Responsabilidades

**O Claude Code deve:**
- Executar análise antes de cada limpeza
- Revisar todos os itens identificados
- Validar impactos antes da remoção
- Garantir integridade do sistema multi-tenant
- Manter documentação atualizada
- Preservar funcionalidades essenciais do AgênciaOS
- Respeitar a arquitetura Next.js 14 e Prisma

## Regras de Desenvolvimento

### 🌐 Idioma
**Sempre responder em português** - Toda comunicação, comentários e documentação devem ser em português.

### ⚛️ React/Next.js - AgênciaOS

#### Estrutura de Componentes
- Use componentes funcionais com interfaces TypeScript
- Use JSX declarativo
- Use `function`, não `const`, para componentes
- Use Shadcn UI, Radix e Tailwind para componentes e estilização
- Implemente design responsivo com Tailwind CSS (mobile-first)
- Coloque conteúdo estático no final dos arquivos
- Use variáveis de conteúdo para conteúdo estático fora das funções render

#### Otimizações Next.js
- Minimize uso de `'use client'`, `useEffect` e `setState` - favoreça RSC
- Use Zod para validação de formulários
- Envolva componentes cliente em Suspense com fallback
- Use carregamento dinâmico para componentes não críticos
- Otimize imagens: formato WebP, dados de tamanho, lazy loading

#### Gerenciamento de Estado Multi-tenant
- Sempre validar `agencyId` em componentes que manipulam dados
- Use React Query para estado do cliente com hooks customizados
- Implemente validação multi-tenant em todos os hooks

### 🔒 Server Actions - AgênciaOS

#### next-safe-action Obrigatório
Use next-safe-action para todas as server actions com validação multi-tenant:

```typescript
'use server'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import type { ActionResponse } from '@/types/actions'

const schema = z.object({
  value: z.string(),
  // agencyId será validado automaticamente via auth
})

export const someAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse<ResultType>> => {
    try {
      const session = await auth()
      if (!session?.user.agencyId) {
        return { success: false, error: 'Não autorizado' }
      }

      // Lógica da ação aqui com isolamento por agencyId
      const result = await db.model.create({
        data: { 
          ...input, 
          agencyId: session.user.agencyId 
        }
      })

      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro inesperado'
      }
    }
  })
```

#### Tratamento de Erros
- Modele erros esperados como valores de retorno
- Use useActionState com react-hook-form para validação
- Use error boundaries para erros inesperados
- Código em services/ sempre lança erros user-friendly
- Implemente error.tsx e global-error.tsx

### 🔄 React Query - AgênciaOS

#### Estrutura de Estado
```typescript
// Hooks customizados para queries multi-tenant
src/
  hooks/
    use-clients.ts          // Hook para clientes da agência
    use-projects.ts         // Hook para projetos
    use-ai-usage.ts         // Hook para uso dos agentes IA
    use-kanban.ts          // Hook para boards Kanban
```

#### Implementação
- Use QueryClient e QueryClientProvider na raiz
- Implemente hooks customizados para queries e mutations
- Use query keys efetivas para cache multi-tenant
- Implemente estados de erro e loading adequados
- Use invalidação de query para refetch de dados
- Estratégia stale-while-revalidate para frescor dos dados

### 🤖 Agentes IA - AgênciaOS

#### Estrutura Obrigatória para Novos Agentes
```typescript
// 1. Componente em src/components/ia/agents/[nome-agente].tsx
'use client'
export function NomeAgente() {
  // Implementação do agente com validação de plano
}

// 2. API route em src/app/api/ai/[nome-agente]/route.ts
export async function POST(request: Request) {
  // Validação de agencyId e limites do plano
  // Integração OpenAI
  // Tracking de uso
}
```

#### Validação de Uso
- Sempre verificar limites do plano (FREE: 20/mês, PRO: 500/mês)
- Registrar uso na tabela `AIUsage`
- Retornar erros claros quando limite excedido

### 📱 Componentes UI

#### Estrutura de Componentes
- Quebre componentes em partes menores com props mínimas
- Use composição para construir componentes complexos
- Structure de micro pastas para componentes
- Ordem: declaração do componente, styled components, tipos TypeScript

#### Shadcn UI
- Use `npx shadcn@latest` (não mais shadcn-ui)
- Importe componentes comuns de `@/components/ui/`
- Componentes específicos da app de `@/components/`

### 🎨 Estilização

#### Tailwind CSS
- Use sempre classes Tailwind para estilização
- Evite CSS ou tags de estilo inline
- Use `class:` ao invés de operador ternário quando possível
- Implemente recursos de acessibilidade (tabindex, aria-label, etc.)

### 📝 Convenções de Código

#### Nomenclatura
- **Booleans**: Use verbos auxiliares (isDisabled, hasError, shouldShow)
- **Arquivos**: Lowercase com separadores de hífen (auth-wizard.tsx)
- **Extensões**: Use .config.ts, .test.ts, .context.tsx, .type.ts, .hook.ts
- **Funções de evento**: Prefixo "handle" (handleClick, handleKeyDown)
- **Variáveis**: Nomes descritivos e explícitos

#### Estrutura de Função
- Use consts ao invés de functions: `const toggle = () =>`
- Defina tipos quando possível
- Use early returns para melhor legibilidade
- Trate erros e edge cases no início das funções
- Use guard clauses para precondições

### 🔐 Multi-tenancy Obrigatório

#### Validação em Todas as Operações
```typescript
// Sempre validar agencyId em queries
const projects = await db.project.findMany({
  where: { agencyId: session.user.agencyId },
  // ...
})

// Sempre incluir agencyId em mutations
const newClient = await db.client.create({
  data: {
    ...clientData,
    agencyId: session.user.agencyId
  }
})
```

### 📊 Performance e Web Vitals

#### Prioridades
1. LCP (Largest Contentful Paint) < 2.5s
2. CLS (Cumulative Layout Shift) < 0.1
3. FID (First Input Delay) < 100ms
4. Minimize bundle size < 500KB inicial
5. API Response Time < 200ms média

### 🚀 Commits e Deploy

#### Mensagens de Commit
**Sempre prefixar com:**
- `feat(component): add new component`
- `fix(api): fix api error`
- `docs(readme): update readme`
- `refactor(utils): refactor utils`
- `style(tailwind): add new tailwind class`
- `test(unit): add unit test`
- `chore(deps): update dependencies`

**Sempre terminar com:**
`Don't forget to commit` + comando de commit sugerido

### 🧪 Testes e Qualidade

#### Obrigatórios
- Testes unitários para novos componentes
- Cobertura de testes para server actions
- Testes de isolamento multi-tenant
- Validação de limites dos agentes IA
- Error boundaries para componentes críticos

### 🔧 Regras Gerais AgênciaOS

1. **Verificar Informação**: Sempre verificar antes de apresentar
2. **Mudanças Arquivo por Arquivo**: Fazer mudanças arquivo por arquivo
3. **Sem Desculpas**: Nunca usar desculpas
4. **Sem Resumos**: Não resumir mudanças feitas
5. **Preservar Código**: Não remover código não relacionado
6. **Edições Únicas**: Fornecer todas as edições em chunk único
7. **Links Reais**: Sempre fornecer links para arquivos reais
8. **Segurança First**: Sempre considerar implicações de segurança
9. **Design Modular**: Encorajar princípios de design modular
10. **Edge Cases**: Sempre considerar e tratar casos extremos

### ⚡ Prioridades Específicas AgênciaOS

1. **Multi-tenancy**: Isolamento perfeito entre agências
2. **Performance IA**: Otimização dos 31 agentes
3. **Segurança**: Validação rigorosa de permissões
4. **Escalabilidade**: Suporte a 1000+ agências simultâneas
5. **UX**: Interface intuitiva para gestão de agências

## Regras Anti-Alucinação e Otimização IA

### 🎯 Prevenção de Alucinações

#### Verificação Obrigatória Antes de Programar
1. **SEMPRE** ler e analisar arquivos existentes antes de criar novos
2. **SEMPRE** verificar imports e dependências reais do projeto
3. **SEMPRE** confirmar estrutura de pastas existente
4. **SEMPRE** validar se bibliotecas/pacotes já estão instalados
5. **NUNCA** assumir funcionalidades que não foram verificadas

#### Processo de Tomada de Decisão
```typescript
// Fluxo obrigatório antes de qualquer implementação:
1. LER arquivos relacionados existentes
2. VERIFICAR package.json para dependências
3. ANALISAR estrutura de pastas atual
4. CONFIRMAR padrões de código existentes
5. IMPLEMENTAR seguindo padrões encontrados
```

#### Validação de Código
- **SEMPRE** verificar se tipos TypeScript existem antes de usar
- **SEMPRE** confirmar se hooks/utilities já existem
- **SEMPRE** validar se componentes UI já foram implementados
- **NUNCA** criar duplicatas de funcionalidades existentes

### 🏆 Seleção do Melhor Caminho

#### Critérios de Decisão Prioritários (AgênciaOS)
1. **Multi-tenancy**: Solução que melhor isola dados por agência
2. **Performance**: Menor impacto no Web Vitals
3. **Manutenibilidade**: Código mais limpo e reutilizável
4. **Segurança**: Validação mais rigorosa de permissões
5. **Escalabilidade**: Suporte para 1000+ agências

#### Hierarquia de Tecnologias (Use nesta ordem)
```typescript
// 1. PRIMEIRO: Verificar se já existe no projeto
// 2. SEGUNDO: Usar tecnologias do stack atual
// 3. TERCEIRO: Adicionar nova dependência apenas se necessário

// Ordem de preferência para soluções:
1. Server Components (Next.js 14)
2. Server Actions com next-safe-action
3. React Query para cliente
4. Componentes Shadcn/UI existentes
5. Utilities existentes em /lib
6. Hooks existentes em /hooks
```

#### Padrões de Implementação Obrigatórios
- **Database**: Sempre usar Prisma com filtro agencyId
- **Auth**: Sempre validar sessão com NextAuth
- **Forms**: Sempre usar React Hook Form + Zod
- **UI**: Sempre usar Shadcn/UI + Tailwind
- **State**: Sempre usar React Query para cliente
- **API**: Sempre usar Server Actions ou API Routes

### 🤖 Automação de Comandos Bash

#### Auto-Aceitar Prompts Comuns
```bash
# Sempre usar flags de auto-confirmação:
npm install --yes
npx shadcn@latest add button --yes
git add . --all
prisma db push --accept-data-loss
npm run build --silent
```

#### Comandos Bash Otimizados para AgênciaOS
```bash
# Desenvolvimento
npm run dev                    # Iniciar desenvolvimento
npm run db:push               # Aplicar mudanças do schema
npm run db:studio             # Abrir Prisma Studio

# Instalação de dependências (sempre com --yes)
npm install [package] --save --yes
npm install [package] --save-dev --yes

# Shadcn UI (sempre com --yes)
npx shadcn@latest add [component] --yes --overwrite

# Git (sempre aceitar mudanças)
git add . && git commit -m "message" --no-verify
git push origin main --force-with-lease

# Prisma (sempre aceitar data loss em dev)
prisma db push --accept-data-loss --skip-generate
prisma generate --no-engine
```

#### Flags de Automação Obrigatórias
- `--yes` ou `-y`: Auto-aceitar instalações
- `--overwrite`: Sobrescrever arquivos existentes
- `--no-verify`: Pular hooks de git em desenvolvimento
- `--accept-data-loss`: Aceitar perda de dados em dev
- `--silent`: Suprimir outputs verbosos
- `--force-with-lease`: Push seguro com força

### 🧠 Processo de Pensamento Estruturado

#### Antes de Qualquer Implementação
1. **PARAR** e analisar o que já existe
2. **LER** arquivos relacionados completamente
3. **IDENTIFICAR** padrões existentes no código
4. **PLANEJAR** seguindo padrões encontrados
5. **IMPLEMENTAR** com validações multi-tenant
6. **TESTAR** isolamento entre agências

#### Checklist Anti-Alucinação
- [ ] Li todos os arquivos relacionados?
- [ ] Verifiquei package.json para dependências?
- [ ] Confirmei estrutura de pastas?
- [ ] Validei padrões de código existentes?
- [ ] Implementei isolamento multi-tenant?
- [ ] Testei com diferentes agencyId?

### 🔍 Análise de Contexto Obrigatória

#### Leitura Sistemática Antes de Implementar
```typescript
// SEMPRE executar esta sequência:
1. LS - Listar arquivos da pasta relevante
2. READ - Ler arquivos de configuração (package.json, tsconfig.json)
3. READ - Ler arquivos de exemplo similares
4. GLOB - Buscar padrões relacionados
5. GREP - Encontrar implementações similares
6. IMPLEMENTAR - Seguir padrões encontrados
```

#### Validação de Decisões
- **PERGUNTA**: Esta solução já existe no projeto?
- **PERGUNTA**: Esta biblioteca já está instalada?
- **PERGUNTA**: Este padrão já é usado em outros lugares?
- **PERGUNTA**: Esta implementação respeita multi-tenancy?
- **PERGUNTA**: Esta solução é a mais performática?

### 📋 Regras de Execução

#### Comandos Bash - Sempre Automáticos
- NUNCA pedir confirmação manual para comandos de desenvolvimento
- SEMPRE usar flags de auto-confirmação
- SEMPRE assumir "yes" para instalações de dependências
- SEMPRE aceitar overwrites de arquivos de configuração
- SEMPRE usar force-with-lease para pushes quando necessário

#### Implementação - Sempre Contextual
- NUNCA implementar sem ler arquivos existentes
- SEMPRE seguir padrões encontrados no código
- SEMPRE validar multi-tenancy em implementações
- SEMPRE usar tecnologias já presentes no projeto
- SEMPRE otimizar para performance e escalabilidade

### 🎯 Resultado Esperado

Com estas regras, o Claude Code deve:
1. **Eliminar alucinações** através de verificação sistemática
2. **Escolher o melhor caminho** baseado em critérios objetivos
3. **Automatizar comandos** para fluxo de desenvolvimento eficiente
4. **Manter consistência** com padrões existentes do AgênciaOS
5. **Garantir qualidade** através de validações obrigatórias