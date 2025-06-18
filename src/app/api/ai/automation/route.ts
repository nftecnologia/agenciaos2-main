import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const workflowBuilderSchema = z.object({
  workflowType: z.enum(['lead_nurturing', 'customer_onboarding', 'sales_follow_up', 'content_distribution', 'customer_support']),
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
  triggerEvent: z.string().min(1, 'Evento de gatilho é obrigatório'),
  desiredOutcome: z.string().min(1, 'Resultado desejado é obrigatório'),
  channels: z.array(z.enum(['email', 'whatsapp', 'sms', 'social_media', 'website', 'crm'])),
  complexity: z.enum(['simple', 'medium', 'complex']).default('medium'),
  audienceSize: z.number().min(1).optional(),
})

const chatbotFlowSchema = z.object({
  platform: z.enum(['whatsapp', 'facebook', 'website', 'instagram', 'telegram']),
  purpose: z.enum(['customer_service', 'lead_generation', 'sales', 'support', 'booking']),
  businessInfo: z.object({
    name: z.string().min(1),
    industry: z.string().min(1),
    products: z.array(z.string()).min(1),
  }),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('friendly'),
  languages: z.array(z.string()).default(['pt-BR']),
  integrations: z.array(z.string()).optional(),
})

const emailAutomationSchema = z.object({
  campaignType: z.enum(['welcome', 'abandoned_cart', 'win_back', 'birthday', 'behavioral', 'educational']),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  goals: z.array(z.string()).min(1, 'Pelo menos um objetivo é obrigatório'),
  sequenceLength: z.number().min(1).max(20).default(5),
  frequency: z.enum(['daily', 'every_other_day', 'weekly', 'bi_weekly']).default('every_other_day'),
  personalization: z.object({
    useFirstName: z.boolean().default(true),
    usePurchaseHistory: z.boolean().default(false),
    useBehaviorData: z.boolean().default(false),
    useLocationData: z.boolean().default(false),
  }),
})

// POST /api/ai/automation - Criador de automações e workflows
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'build-workflow') {
      const validatedData = workflowBuilderSchema.parse(data)
      
      const complexityLevels = {
        simple: '3-5 etapas, lógica básica',
        medium: '6-10 etapas, condicionais intermediárias',
        complex: '10+ etapas, lógica avançada com múltiplas ramificações'
      }

      const prompt = `Crie um workflow de automação completo:
      
      Tipo: ${validatedData.workflowType}
      Negócio: ${validatedData.businessType}
      Gatilho: ${validatedData.triggerEvent}
      Resultado desejado: ${validatedData.desiredOutcome}
      Canais: ${validatedData.channels.join(', ')}
      Complexidade: ${validatedData.complexity} (${complexityLevels[validatedData.complexity]})
      ${validatedData.audienceSize ? `Tamanho da audiência: ${validatedData.audienceSize.toLocaleString()}` : ''}
      
      Desenvolva um workflow detalhado e acionável:
      
      1. VISÃO GERAL DO WORKFLOW:
         - Objetivo principal
         - KPIs de sucesso
         - ROI esperado
         - Timeline de implementação
         - Recursos necessários
      
      2. MAPEAMENTO COMPLETO:
         - Evento gatilho detalhado
         - Condições de entrada
         - Jornada passo a passo
         - Pontos de decisão
         - Caminhos alternativos
         - Condições de saída
      
      3. ESTRUTURA DO WORKFLOW:
         
         GATILHO INICIAL:
         - Especificações técnicas
         - Dados capturados
         - Validações necessárias
         
         ${validatedData.complexity === 'simple' ? `
         SEQUÊNCIA BÁSICA (3-5 etapas):
         - Etapa 1: Ação imediata
         - Etapa 2: Acompanhamento
         - Etapa 3: Resultado final
         ` : ''}
         
         ${validatedData.complexity === 'medium' ? `
         SEQUÊNCIA INTERMEDIÁRIA (6-10 etapas):
         - Etapas de qualificação
         - Ramificações condicionais
         - Ações personalizadas
         - Follow-ups automatizados
         ` : ''}
         
         ${validatedData.complexity === 'complex' ? `
         SEQUÊNCIA AVANÇADA (10+ etapas):
         - Múltiplas ramificações
         - Scoring dinâmico
         - Inteligência comportamental
         - Otimização automática
         ` : ''}
      
      4. CONFIGURAÇÃO POR CANAL:
         ${validatedData.channels.map(channel => `
         ${channel.toUpperCase()}:
         - Configurações específicas
         - Templates de mensagem
         - Horários de envio
         - Frequência recomendada
         - Personalização aplicada
         `).join('')}
      
      5. LÓGICA CONDICIONAL:
         - IF/THEN/ELSE statements
         - Critérios de segmentação
         - Ações baseadas em comportamento
         - Regras de priorização
         - Exceções e tratamentos
      
      6. PERSONALIZAÇÃO E SEGMENTAÇÃO:
         - Dados para personalizar
         - Critérios de segmentação
         - Mensagens dinâmicas
         - Ofertas direcionadas
         - Timing personalizado
      
      7. INTEGRAÇÃO DE SISTEMAS:
         - APIs necessárias
         - Sincronização de dados
         - Webhooks recomendados
         - Backup de dados
         - Logs de auditoria
      
      8. MÉTRICAS E MONITORAMENTO:
         - KPIs primários
         - KPIs secundários
         - Dashboards recomendados
         - Alertas automatizados
         - Relatórios periódicos
      
      9. OTIMIZAÇÃO CONTÍNUA:
         - Testes A/B sugeridos
         - Pontos de otimização
         - Análise de performance
         - Ajustes recomendados
         - Escalabilidade
      
      10. IMPLEMENTAÇÃO:
          - Ferramentas recomendadas
          - Configuração técnica
          - Cronograma de deploy
          - Testes necessários
          - Go-live checklist
      
      11. DOCUMENTAÇÃO:
          - Manual operacional
          - Troubleshooting guide
          - Contatos de suporte
          - Atualizações futuras
      
      Inclua diagramas de fluxo (descrições) e exemplos práticos.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'workflow-builder', 600, 0.012)

      return NextResponse.json({
        workflow: content,
        metadata: {
          workflowType: validatedData.workflowType,
          complexity: validatedData.complexity,
          channels: validatedData.channels,
          triggerEvent: validatedData.triggerEvent,
        },
        usage: {
          tokens: 600,
          cost: 0.012
        }
      })
    }

    if (action === 'create-chatbot') {
      const validatedData = chatbotFlowSchema.parse(data)
      
      const platformSpecs = {
        whatsapp: 'WhatsApp Business API, mensagens rápidas, mídia',
        facebook: 'Messenger Platform, cards, quick replies',
        website: 'Widget embarcado, integração com CRM',
        instagram: 'Instagram Messaging, visual-first',
        telegram: 'Telegram Bot API, comandos, keyboards'
      }

      const prompt = `Crie um chatbot completo para ${validatedData.platform}:
      
      Plataforma: ${validatedData.platform} (${platformSpecs[validatedData.platform]})
      Propósito: ${validatedData.purpose}
      Empresa: ${validatedData.businessInfo.name}
      Setor: ${validatedData.businessInfo.industry}
      Produtos: ${validatedData.businessInfo.products.join(', ')}
      Tom: ${validatedData.tone}
      Idiomas: ${validatedData.languages.join(', ')}
      ${validatedData.integrations ? `Integrações: ${validatedData.integrations.join(', ')}` : ''}
      
      Desenvolva um chatbot inteligente e conversacional:
      
      1. ARQUITETURA DO CHATBOT:
         - Fluxo principal de conversação
         - Menus e opções
         - Intents principais
         - Fallbacks e erro handling
         - Handoff para humanos
      
      2. SAUDAÇÃO E BOAS-VINDAS:
         - Mensagem inicial personalizada
         - Apresentação da empresa
         - Menu principal
         - Opções rápidas
         - Call-to-action inicial
      
      3. FLUXOS DE CONVERSAÇÃO:
         
         ${validatedData.purpose === 'customer_service' ? `
         ATENDIMENTO AO CLIENTE:
         - FAQ automatizado
         - Resolução de problemas
         - Status de pedidos
         - Políticas da empresa
         - Escalação para humanos
         ` : ''}
         
         ${validatedData.purpose === 'lead_generation' ? `
         GERAÇÃO DE LEADS:
         - Qualificação inicial
         - Captura de contato
         - Agendamento de reuniões
         - Download de materiais
         - Nutrição de leads
         ` : ''}
         
         ${validatedData.purpose === 'sales' ? `
         VENDAS:
         - Apresentação de produtos
         - Configuração de pedidos
         - Cálculo de preços
         - Processamento de pagamentos
         - Confirmação de compra
         ` : ''}
         
         ${validatedData.purpose === 'support' ? `
         SUPORTE TÉCNICO:
         - Diagnóstico de problemas
         - Guias passo a passo
         - Tutoriais interativos
         - Agendamento de técnicos
         - Feedback de satisfação
         ` : ''}
         
         ${validatedData.purpose === 'booking' ? `
         AGENDAMENTOS:
         - Verificação de disponibilidade
         - Seleção de serviços
         - Escolha de horários
         - Confirmação de dados
         - Lembretes automáticos
         ` : ''}
      
      4. RESPOSTAS INTELIGENTES:
         - Processamento de linguagem natural
         - Reconhecimento de intenções
         - Respostas contextuais
         - Sugestões proativas
         - Aprendizado contínuo
      
      5. PERSONALIZAÇÃO:
         - Uso de nome do usuário
         - Histórico de conversas
         - Preferências salvas
         - Recomendações personalizadas
         - Contexto de relacionamento
      
      6. RECURSOS INTERATIVOS:
         - Botões de ação rápida
         - Carroseis de produtos
         - Formulários integrados
         - Compartilhamento de mídia
         - Links e integrações
      
      7. INTEGRAÇÃO COM SISTEMAS:
         - CRM sync
         - Base de conhecimento
         - Sistema de pedidos
         - Agenda/calendário
         - Analytics tracking
      
      8. TRATAMENTO DE ERROS:
         - Mensagens não compreendidas
         - Opções de reformulação
         - Direcionamento alternativo
         - Escalação inteligente
         - Recovery flows
      
      9. ANALYTICS E MÉTRICAS:
         - Taxa de resolução
         - Satisfação do usuário
         - Tempo de resposta
         - Conversões realizadas
         - Pontos de abandono
      
      10. SCRIPTS DE CONVERSAÇÃO:
          - Mensagens por cada etapa
          - Variações de resposta
          - Perguntas de qualificação
          - Confirmações necessárias
          - Despedidas personalizadas
      
      11. CONFIGURAÇÃO TÉCNICA:
          - Webhooks necessários
          - APIs para integrar
          - Variáveis de sessão
          - Persistência de dados
          - Segurança e privacidade
      
      12. TREINAMENTO E OTIMIZAÇÃO:
          - Cenários de teste
          - Frases de treinamento
          - Feedback loops
          - Melhorias iterativas
          - A/B testing
      
      Forneça exemplos de diálogos completos e configurações técnicas.`

      const content = await generateText(prompt, 'whatsapp')
      await trackAIUsage(context.agencyId, 'chatbot-builder', 500, 0.010)

      return NextResponse.json({
        chatbot: content,
        metadata: {
          platform: validatedData.platform,
          purpose: validatedData.purpose,
          businessName: validatedData.businessInfo.name,
          tone: validatedData.tone,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    if (action === 'create-email-automation') {
      const validatedData = emailAutomationSchema.parse(data)
      
      const campaignDescriptions = {
        welcome: 'Série de boas-vindas para novos assinantes',
        abandoned_cart: 'Recuperação de carrinho abandonado',
        win_back: 'Reativação de clientes inativos',
        birthday: 'Campanhas de aniversário personalizadas',
        behavioral: 'Baseada em comportamento do usuário',
        educational: 'Série educativa e de nutrição'
      }

      const prompt = `Crie uma automação de e-mail completa:
      
      Tipo de campanha: ${validatedData.campaignType} (${campaignDescriptions[validatedData.campaignType]})
      Público-alvo: ${validatedData.targetAudience}
      Objetivos: ${validatedData.goals.join(', ')}
      Número de e-mails: ${validatedData.sequenceLength}
      Frequência: ${validatedData.frequency}
      
      PERSONALIZAÇÃO:
      - Usar primeiro nome: ${validatedData.personalization.useFirstName ? 'Sim' : 'Não'}
      - Histórico de compras: ${validatedData.personalization.usePurchaseHistory ? 'Sim' : 'Não'}
      - Dados comportamentais: ${validatedData.personalization.useBehaviorData ? 'Sim' : 'Não'}
      - Dados de localização: ${validatedData.personalization.useLocationData ? 'Sim' : 'Não'}
      
      Desenvolva uma sequência de e-mail automation completa:
      
      1. ESTRATÉGIA GERAL:
         - Objetivo principal da sequência
         - Jornada do cliente mapeada
         - KPIs de sucesso
         - ROI esperado
         - Timeline de execução
      
      2. CONFIGURAÇÃO DO GATILHO:
         - Evento que inicia a sequência
         - Condições de entrada
         - Segmentação inicial
         - Dados capturados
         - Validações necessárias
      
      3. SEQUÊNCIA COMPLETA (${validatedData.sequenceLength} e-mails):
         
         ${Array.from({ length: validatedData.sequenceLength }, (_, i) => `
         E-MAIL ${i + 1} (Enviado ${i === 0 ? 'imediatamente' : `${i * (validatedData.frequency === 'daily' ? 1 : validatedData.frequency === 'every_other_day' ? 2 : validatedData.frequency === 'weekly' ? 7 : 14)} dias após o anterior`}):
         
         Objetivo: [Definir objetivo específico]
         
         Subject Lines (3 variações):
         - Versão A: [Principal]
         - Versão B: [Curiosidade]
         - Versão C: [Urgência/Benefício]
         
         Preview Text: [90-100 caracteres]
         
         Conteúdo Principal:
         - Abertura personalizada
         - Corpo da mensagem
         - Call-to-action principal
         - P.S. (quando apropriado)
         
         Elementos de Personalização:
         ${validatedData.personalization.useFirstName ? '- Nome personalizado' : ''}
         ${validatedData.personalization.usePurchaseHistory ? '- Referências a compras anteriores' : ''}
         ${validatedData.personalization.useBehaviorData ? '- Conteúdo baseado em comportamento' : ''}
         ${validatedData.personalization.useLocationData ? '- Ofertas baseadas em localização' : ''}
         
         Métricas esperadas:
         - Open rate: [%]
         - Click rate: [%]
         - Conversion rate: [%]
         
         `).join('')}
      
      4. LÓGICA CONDICIONAL:
         - Regras de segmentação
         - Comportamentos que alteram o fluxo
         - Caminhos alternativos
         - Condições de saída
         - Re-engagement flows
      
      5. DESIGN E TEMPLATE:
         - Estrutura visual
         - Elementos de branding
         - Mobile optimization
         - Acessibilidade
         - Loading speed
      
      6. PERSONALIZAÇÃO AVANÇADA:
         - Dynamic content
         - Product recommendations
         - Location-based offers
         - Behavior triggers
         - Timing optimization
      
      7. TESTES E OTIMIZAÇÃO:
         - A/B tests recomendados
         - Variáveis a testar
         - Cronograma de testes
         - Métricas de decisão
         - Otimizações contínuas
      
      8. INTEGRAÇÃO TÉCNICA:
         - Plataforma de e-mail marketing
         - CRM integration
         - Analytics tracking
         - Webhooks necessários
         - Data synchronization
      
      9. MÉTRICAS E RELATÓRIOS:
         - KPIs primários
         - KPIs secundários
         - Frequency de relatórios
         - Dashboards recomendados
         - Alertas automatizados
      
      10. COMPLIANCE E PRIVACIDADE:
          - LGPD compliance
          - Opt-out mechanisms
          - Data protection
          - Consent management
          - Privacy policies
      
      11. CRONOGRAMA DE IMPLEMENTAÇÃO:
          - Setup inicial
          - Testes de qualidade
          - Soft launch
          - Full deployment
          - Monitoring período
      
      12. OTIMIZAÇÃO PÓS-LANÇAMENTO:
          - Performance analysis
          - Feedback collection
          - Iterative improvements
          - Scale strategies
          - Advanced features
      
      Forneça templates completos e configurações técnicas detalhadas.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'email-automation', 550, 0.011)

      return NextResponse.json({
        automation: content,
        metadata: {
          campaignType: validatedData.campaignType,
          sequenceLength: validatedData.sequenceLength,
          frequency: validatedData.frequency,
          personalization: validatedData.personalization,
        },
        usage: {
          tokens: 550,
          cost: 0.011
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "build-workflow", "create-chatbot" ou "create-email-automation"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no criador de automações:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}