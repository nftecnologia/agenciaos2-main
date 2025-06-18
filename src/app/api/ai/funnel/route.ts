import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const funnelBuilderSchema = z.object({
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  budget: z.enum(['low', 'medium', 'high']).default('medium'),
  funnelType: z.enum(['lead_generation', 'sales', 'webinar', 'ecommerce', 'consultation']),
  avgTicket: z.number().min(0).optional(),
  conversionGoal: z.string().min(1, 'Meta de conversão é obrigatória'),
})

const landingPageSchema = z.object({
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  mainBenefit: z.string().min(1, 'Principal benefício é obrigatório'),
  painPoints: z.array(z.string()).min(1, 'Pelo menos uma dor é obrigatória'),
  socialProof: z.string().optional(),
  urgency: z.string().optional(),
  pageType: z.enum(['squeeze', 'sales', 'webinar', 'app_download', 'consultation']),
})

const emailSequenceSchema = z.object({
  funnelType: z.enum(['lead_nurturing', 'sales', 'onboarding', 'cart_abandonment', 'reactivation']),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  sequenceLength: z.number().min(3).max(15).default(7),
  daysBetween: z.number().min(1).max(7).default(2),
  tone: z.enum(['professional', 'casual', 'friendly', 'urgent']).default('friendly'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
})

// POST /api/ai/funnel - Criador de funis de vendas
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create-funnel') {
      const validatedData = funnelBuilderSchema.parse(data)
      
      const prompt = `Crie um funil de vendas completo para:
      
      Negócio: ${validatedData.businessType}
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Tipo de funil: ${validatedData.funnelType}
      Orçamento: ${validatedData.budget}
      ${validatedData.avgTicket ? `Ticket médio: R$ ${validatedData.avgTicket}` : ''}
      Meta de conversão: ${validatedData.conversionGoal}
      
      Estruture o funil com todas as etapas:
      
      1. TOPO DO FUNIL (Atração):
         - Estratégias de tráfego
         - Conteúdo para atração
         - Iscas digitais
         - Canais de divulgação
      
      2. MEIO DO FUNIL (Consideração):
         - Sequência de e-mails
         - Conteúdo educativo
         - Webinars/demos
         - Remarketing
      
      3. FUNDO DO FUNIL (Conversão):
         - Páginas de vendas
         - Ofertas irresistíveis
         - Urgência e escassez
         - Processamento de pagamento
      
      4. PÓS-VENDA (Retenção):
         - Onboarding
         - Upsell/Cross-sell
         - Fidelização
         - Recomendações
      
      Para cada etapa, inclua:
      - Objetivos específicos
      - Métricas de acompanhamento
      - Ferramentas recomendadas
      - Cronograma de implementação
      - Orçamento estimado por canal
      - Pontos de otimização
      
      Inclua também um fluxograma visual do funil e KPIs principais.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'funnel-builder', 600, 0.012)

      return NextResponse.json({
        funnel: content,
        metadata: {
          businessType: validatedData.businessType,
          funnelType: validatedData.funnelType,
          targetAudience: validatedData.targetAudience,
          budget: validatedData.budget,
        },
        usage: {
          tokens: 600,
          cost: 0.012
        }
      })
    }

    if (action === 'create-landing-page') {
      const validatedData = landingPageSchema.parse(data)
      
      const prompt = `Crie uma landing page otimizada para conversão:
      
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Principal benefício: ${validatedData.mainBenefit}
      Dores do público: ${validatedData.painPoints.join(', ')}
      Tipo de página: ${validatedData.pageType}
      ${validatedData.socialProof ? `Prova social: ${validatedData.socialProof}` : ''}
      ${validatedData.urgency ? `Urgência: ${validatedData.urgency}` : ''}
      
      Crie uma estrutura completa com:
      
      1. HEADLINE PRINCIPAL:
         - Impactante e clara
         - Foco no benefício principal
         - Teste A/B sugerido
      
      2. SUB-HEADLINE:
         - Complementa a headline
         - Adiciona contexto
      
      3. SEÇÕES DA PÁGINA:
         - Hero section
         - Benefícios (com ícones)
         - Como funciona
         - Prova social/depoimentos
         - Objeções comuns
         - Garantia
         - FAQ
         - CTA final
      
      4. ELEMENTOS DE CONVERSÃO:
         - Call-to-actions (múltiplas variações)
         - Formulários otimizados
         - Botões de ação
         - Elementos de urgência
         - Prova social
      
      5. COPY COMPLETO:
         - Texto para cada seção
         - Títulos persuasivos
         - Bullets de benefícios
         - Textos de CTA
      
      6. ELEMENTOS VISUAIS:
         - Sugestões de imagens
         - Vídeos recomendados
         - Infográficos
         - Cores e design
      
      7. OTIMIZAÇÕES:
         - Mobile-first
         - Velocidade de carregamento
         - SEO básico
         - Pixels de rastreamento
      
      Inclua métricas de conversão esperadas e testes recomendados.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'landing-page', 500, 0.010)

      return NextResponse.json({
        landingPage: content,
        metadata: {
          product: validatedData.product,
          pageType: validatedData.pageType,
          mainBenefit: validatedData.mainBenefit,
          painPoints: validatedData.painPoints,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    if (action === 'create-email-sequence') {
      const validatedData = emailSequenceSchema.parse(data)
      
      const prompt = `Crie uma sequência de e-mails para:
      
      Tipo: ${validatedData.funnelType}
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Quantidade: ${validatedData.sequenceLength} e-mails
      Intervalo: ${validatedData.daysBetween} dias
      Tom: ${validatedData.tone}
      
      Crie uma sequência estratégica com:
      
      EMAIL 1 - Boas-vindas:
      - Apresentação
      - Definir expectativas
      - Primeiro valor
      
      EMAIL 2 - Educação:
      - Conteúdo educativo
      - Construir autoridade
      - Engajamento
      
      EMAIL 3 - Problema/Solução:
      - Identificar dores
      - Apresentar solução
      - Casos de uso
      
      EMAIL 4 - Prova Social:
      - Depoimentos
      - Casos de sucesso
      - Credibilidade
      
      EMAIL 5 - Oferta:
      - Apresentar produto
      - Benefícios claros
      - Call-to-action
      
      ${validatedData.sequenceLength > 5 ? `
      EMAILS ADICIONAIS:
      - Objeções comuns
      - Urgência/escassez
      - Última chance
      - Reativação
      ` : ''}
      
      Para cada e-mail, inclua:
      - Assunto (3 variações)
      - Linha de preview
      - Corpo completo
      - Call-to-action
      - P.S. (quando apropriado)
      - Melhor horário de envio
      - Métricas esperadas
      
      Inclua estratégias de segmentação e personalização.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'email-sequence', 450, 0.009)

      return NextResponse.json({
        emailSequence: content,
        metadata: {
          funnelType: validatedData.funnelType,
          sequenceLength: validatedData.sequenceLength,
          daysBetween: validatedData.daysBetween,
          tone: validatedData.tone,
        },
        usage: {
          tokens: 450,
          cost: 0.009
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "create-funnel", "create-landing-page" ou "create-email-sequence"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no criador de funil:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}