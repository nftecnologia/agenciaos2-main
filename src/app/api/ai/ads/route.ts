import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const adCreativeSchema = z.object({
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube']),
  adType: z.enum(['search', 'display', 'video', 'shopping', 'lead_gen', 'conversion']),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  budget: z.number().min(1, 'Orçamento é obrigatório'),
  objective: z.enum(['traffic', 'conversions', 'awareness', 'engagement', 'leads', 'sales']),
  tone: z.enum(['professional', 'casual', 'urgent', 'friendly', 'authoritative']).default('professional'),
  keyMessages: z.array(z.string()).optional(),
})

const campaignStrategySchema = z.object({
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
  products: z.array(z.string()).min(1, 'Pelo menos um produto é obrigatório'),
  targetAudiences: z.array(z.string()).min(1, 'Pelo menos um público é obrigatório'),
  budget: z.number().min(100, 'Orçamento mínimo é R$ 100'),
  duration: z.number().min(7).max(365).default(30), // dias
  platforms: z.array(z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'])),
  mainObjective: z.enum(['traffic', 'conversions', 'awareness', 'engagement', 'leads', 'sales']),
  kpis: z.array(z.string()).optional(),
})

const adOptimizationSchema = z.object({
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube']),
  currentPerformance: z.object({
    impressions: z.number(),
    clicks: z.number(),
    conversions: z.number(),
    cost: z.number(),
    ctr: z.number().optional(),
    cpc: z.number().optional(),
    cpa: z.number().optional(),
  }),
  campaignData: z.object({
    objective: z.string(),
    audience: z.string(),
    creative: z.string(),
    budget: z.number(),
  }),
  issues: z.array(z.string()).optional(),
})

// POST /api/ai/ads - Criador e otimizador de anúncios
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create-ad-creative') {
      const validatedData = adCreativeSchema.parse(data)
      
      const platformSpecs = {
        google: 'Headlines: 30 chars, Descriptions: 90 chars',
        facebook: 'Texto: 125 chars, Headlines: 40 chars',
        instagram: 'Caption: 2200 chars, Stories: texto curto',
        linkedin: 'Texto: 150 chars, profissional',
        tiktok: 'Texto: 100 chars, criativo e jovem',
        youtube: 'Títulos: 100 chars, descrições: 1000 chars'
      }

      const prompt = `Crie creativos de anúncio otimizados para ${validatedData.platform}:
      
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Tipo de anúncio: ${validatedData.adType}
      Objetivo: ${validatedData.objective}
      Orçamento: R$ ${validatedData.budget}
      Tom: ${validatedData.tone}
      ${validatedData.keyMessages ? `Mensagens-chave: ${validatedData.keyMessages.join(', ')}` : ''}
      
      Especificações da plataforma: ${platformSpecs[validatedData.platform]}
      
      Crie múltiplas variações para teste A/B:
      
      1. HEADLINES/TÍTULOS:
         - 5 variações impactantes
         - Incluir benefício principal
         - Usar números quando possível
         - Criar senso de urgência
         - Adequado ao limite de caracteres
      
      2. DESCRIÇÕES/TEXTOS:
         - 3 versões diferentes
         - Foco na proposta de valor
         - Call-to-action claro
         - Abordar objeções
         - Proof points/credibilidade
      
      3. CALL-TO-ACTIONS:
         - 5 CTAs diferentes
         - Específicos para o objetivo
         - Orientados à ação
         - Variações de urgência
      
      4. SEGMENTAÇÃO DE PÚBLICO:
         - Demograficos específicos
         - Interesses relevantes
         - Comportamentos de compra
         - Lookalike audiences
         - Exclusões importantes
      
      5. ELEMENTOS VISUAIS:
         - Sugestões de imagens/vídeos
         - Cores que convertem
         - Elementos de destaque
         - Formatos por plataforma
      
      6. CONFIGURAÇÕES DE CAMPANHA:
         - Estratégia de lance
         - Cronograma otimizado
         - Localização geográfica
         - Dispositivos preferidos
         - Placements recomendados
      
      7. ESTRUTURA DE TESTES:
         - Variáveis a testar
         - Cronograma de testes
         - Métricas de sucesso
         - Critérios de otimização
      
      Inclua estimativas de performance e budget allocation.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'ad-creative', 450, 0.009)

      return NextResponse.json({
        adCreative: content,
        metadata: {
          platform: validatedData.platform,
          adType: validatedData.adType,
          objective: validatedData.objective,
          budget: validatedData.budget,
        },
        usage: {
          tokens: 450,
          cost: 0.009
        }
      })
    }

    if (action === 'create-campaign-strategy') {
      const validatedData = campaignStrategySchema.parse(data)
      
      const prompt = `Crie uma estratégia completa de campanhas de anúncios:
      
      Negócio: ${validatedData.businessType}
      Produtos: ${validatedData.products.join(', ')}
      Públicos-alvo: ${validatedData.targetAudiences.join(', ')}
      Orçamento total: R$ ${validatedData.budget}
      Duração: ${validatedData.duration} dias
      Plataformas: ${validatedData.platforms.join(', ')}
      Objetivo principal: ${validatedData.mainObjective}
      ${validatedData.kpis ? `KPIs: ${validatedData.kpis.join(', ')}` : ''}
      
      Desenvolva uma estratégia multi-plataforma:
      
      1. ANÁLISE ESTRATÉGICA:
         - Market size e oportunidades
         - Análise da concorrência
         - Posicionamento único
         - Sazonalidades
      
      2. ESTRATÉGIA DE FUNIL:
         - Campanha de awareness (TOFU)
         - Campanha de consideração (MOFU)
         - Campanha de conversão (BOFU)
         - Campanhas de retenção
      
      3. DISTRIBUIÇÃO DE ORÇAMENTO:
         - Alocação por plataforma
         - Alocação por objetivo
         - Alocação por público
         - Reserve para testes
      
      4. CRONOGRAMA DE LANÇAMENTO:
         - Semana 1-2: Setup e testes
         - Semana 3-4: Escala inicial
         - Resto do período: Otimização
         - Marcos de avaliação
      
      5. SEGMENTAÇÃO DE PÚBLICOS:
         - Personas detalhadas
         - Custom audiences
         - Lookalike audiences
         - Públicos de remarketing
         - Exclusões estratégicas
      
      6. CREATIVOS POR ETAPA:
         - Formatos por plataforma
         - Mensagens por público
         - Variações sazonais
         - Refresh de creativos
      
      7. MÉTRICAS E KPIs:
         - KPIs primários
         - KPIs secundários
         - Benchmarks da indústria
         - Frequência de relatórios
      
      8. OTIMIZAÇÃO CONTÍNUA:
         - Ciclos de teste
         - Critérios de pause
         - Escalabilidade
         - Budget reallocation
      
      9. FERRAMENTAS RECOMENDADAS:
         - Plataformas de gestão
         - Ferramentas de creative
         - Analytics e atribuição
         - Automações
      
      10. PLANO DE CONTINGÊNCIA:
          - Cenários de baixa performance
          - Ajustes de orçamento
          - Mudanças de estratégia
          - Backup campaigns
      
      Inclua um dashboard de acompanhamento com métricas principais.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'campaign-strategy', 600, 0.012)

      return NextResponse.json({
        strategy: content,
        metadata: {
          businessType: validatedData.businessType,
          platforms: validatedData.platforms,
          budget: validatedData.budget,
          duration: validatedData.duration,
        },
        usage: {
          tokens: 600,
          cost: 0.012
        }
      })
    }

    if (action === 'optimize-campaign') {
      const validatedData = adOptimizationSchema.parse(data)
      
      const ctr = validatedData.currentPerformance.ctr || 
                  (validatedData.currentPerformance.clicks / validatedData.currentPerformance.impressions) * 100
      const cpc = validatedData.currentPerformance.cpc || 
                  validatedData.currentPerformance.cost / validatedData.currentPerformance.clicks
      const cpa = validatedData.currentPerformance.cpa || 
                  validatedData.currentPerformance.cost / validatedData.currentPerformance.conversions

      const prompt = `Analise e otimize esta campanha de anúncios:
      
      PLATAFORMA: ${validatedData.platform}
      
      PERFORMANCE ATUAL:
      - Impressões: ${validatedData.currentPerformance.impressions.toLocaleString()}
      - Cliques: ${validatedData.currentPerformance.clicks.toLocaleString()}
      - Conversões: ${validatedData.currentPerformance.conversions}
      - Investimento: R$ ${validatedData.currentPerformance.cost.toLocaleString()}
      - CTR: ${ctr.toFixed(2)}%
      - CPC: R$ ${cpc.toFixed(2)}
      - CPA: R$ ${cpa.toFixed(2)}
      
      DADOS DA CAMPANHA:
      - Objetivo: ${validatedData.campaignData.objective}
      - Público: ${validatedData.campaignData.audience}
      - Creative: ${validatedData.campaignData.creative}
      - Orçamento: R$ ${validatedData.campaignData.budget}
      
      ${validatedData.issues ? `PROBLEMAS IDENTIFICADOS: ${validatedData.issues.join(', ')}` : ''}
      
      Forneça análise completa e recomendações:
      
      1. DIAGNÓSTICO DE PERFORMANCE:
         - Benchmarks da indústria
         - Pontos fortes da campanha
         - Gargalos identificados
         - Oportunidades perdidas
      
      2. OTIMIZAÇÕES IMEDIATAS:
         - Ajustes de lance
         - Refinamento de público
         - Pausar segmentos ruins
         - Aumentar budget nos winners
      
      3. OTIMIZAÇÕES DE CREATIVE:
         - Novos headlines
         - Imagens/vídeos
         - Call-to-actions
         - Formatos diferentes
      
      4. OTIMIZAÇÕES DE TARGETING:
         - Inclusões estratégicas
         - Exclusões necessárias
         - Ajuste de demograficos
         - Novos interesses
      
      5. OTIMIZAÇÕES TÉCNICAS:
         - Configurações de campanha
         - Estratégia de lance
         - Cronograma de exibição
         - Dispositivos e locais
      
      6. TESTES RECOMENDADOS:
         - A/B tests prioritários
         - Cronograma de testes
         - Métricas de sucesso
         - Budget para testes
      
      7. PROJEÇÕES:
         - Performance esperada
         - ROI estimado
         - Timeline de melhoria
         - Investimento recomendado
      
      8. PLANO DE AÇÃO:
         - Ações imediatas (24h)
         - Ações de curto prazo (1 semana)
         - Ações de médio prazo (1 mês)
         - Monitoramento contínuo
      
      Priorize as otimizações por impacto e facilidade de implementação.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'ad-optimization', 500, 0.010)

      return NextResponse.json({
        optimization: content,
        currentMetrics: {
          ctr: parseFloat(ctr.toFixed(2)),
          cpc: parseFloat(cpc.toFixed(2)),
          cpa: parseFloat(cpa.toFixed(2)),
          roi: validatedData.currentPerformance.conversions > 0 ? 
               parseFloat(((validatedData.currentPerformance.conversions * 100 - validatedData.currentPerformance.cost) / validatedData.currentPerformance.cost * 100).toFixed(2)) : 0
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "create-ad-creative", "create-campaign-strategy" ou "optimize-campaign"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no criador de anúncios:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}