import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const analyticsReportSchema = z.object({
  platform: z.enum(['google_analytics', 'facebook_ads', 'google_ads', 'instagram', 'website', 'email_marketing']),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  metrics: z.object({
    impressions: z.number().optional(),
    clicks: z.number().optional(),
    conversions: z.number().optional(),
    revenue: z.number().optional(),
    cost: z.number().optional(),
    sessions: z.number().optional(),
    users: z.number().optional(),
    pageviews: z.number().optional(),
    bounceRate: z.number().optional(),
    avgSessionDuration: z.number().optional(),
  }),
  goals: z.array(z.string()).optional(),
  previousPeriodData: z.object({
    impressions: z.number().optional(),
    clicks: z.number().optional(),
    conversions: z.number().optional(),
    revenue: z.number().optional(),
    cost: z.number().optional(),
    sessions: z.number().optional(),
    users: z.number().optional(),
  }).optional(),
})

const performanceAnalysisSchema = z.object({
  campaigns: z.array(z.object({
    name: z.string(),
    platform: z.string(),
    budget: z.number(),
    spent: z.number(),
    impressions: z.number(),
    clicks: z.number(),
    conversions: z.number(),
    revenue: z.number().optional(),
  })),
  timeframe: z.string(),
  objectives: z.array(z.string()),
  kpis: z.array(z.string()),
})

const predictiveAnalysisSchema = z.object({
  historicalData: z.array(z.object({
    date: z.string(),
    metric: z.string(),
    value: z.number(),
  })),
  predictMetric: z.enum(['revenue', 'conversions', 'traffic', 'cost', 'roi']),
  forecastPeriod: z.number().min(1).max(365), // dias
  currentTrends: z.array(z.string()).optional(),
  seasonality: z.boolean().default(false),
  externalFactors: z.array(z.string()).optional(),
})

// POST /api/ai/analytics - Análise inteligente de dados
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'generate-report') {
      const validatedData = analyticsReportSchema.parse(data)
      
      const calculateMetrics = (current: any, previous: any) => {
        const metrics: any = {}
        
        Object.keys(current).forEach(key => {
          if (current[key] !== undefined && previous && previous[key] !== undefined) {
            const change = ((current[key] - previous[key]) / previous[key]) * 100
            metrics[`${key}Change`] = parseFloat(change.toFixed(2))
          }
        })
        
        // Calcular métricas derivadas
        if (current.clicks && current.impressions) {
          metrics.ctr = parseFloat(((current.clicks / current.impressions) * 100).toFixed(2))
        }
        
        if (current.cost && current.clicks) {
          metrics.cpc = parseFloat((current.cost / current.clicks).toFixed(2))
        }
        
        if (current.cost && current.conversions) {
          metrics.cpa = parseFloat((current.cost / current.conversions).toFixed(2))
        }
        
        if (current.revenue && current.cost) {
          metrics.roas = parseFloat((current.revenue / current.cost).toFixed(2))
        }
        
        if (current.sessions && current.pageviews) {
          metrics.pagesPerSession = parseFloat((current.pageviews / current.sessions).toFixed(2))
        }
        
        return metrics
      }
      
      const derivedMetrics = calculateMetrics(validatedData.metrics, validatedData.previousPeriodData)

      const startDate = new Date(validatedData.dateRange.start).toLocaleDateString('pt-BR')
      const endDate = new Date(validatedData.dateRange.end).toLocaleDateString('pt-BR')

      const prompt = `Crie um relatório analítico detalhado para ${validatedData.platform}:
      
      PERÍODO: ${startDate} a ${endDate}
      
      MÉTRICAS PRINCIPAIS:
      ${Object.entries(validatedData.metrics)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `- ${key}: ${typeof value === 'number' ? value.toLocaleString('pt-BR') : value}`)
        .join('\n')}
      
      MÉTRICAS CALCULADAS:
      ${Object.entries(derivedMetrics)
        .map(([key, value]) => `- ${key}: ${value}${key.includes('Change') ? '%' : ''}`)
        .join('\n')}
      
      ${validatedData.goals ? `OBJETIVOS: ${validatedData.goals.join(', ')}` : ''}
      
      Crie um relatório abrangente incluindo:
      
      1. RESUMO EXECUTIVO:
         - Performance geral do período
         - Principais destaques
         - Tendências identificadas
         - Status dos objetivos
      
      2. ANÁLISE DE PERFORMANCE:
         - Métricas vs período anterior
         - Benchmarks da indústria
         - Pontos fortes identificados
         - Áreas de melhoria
      
      3. INSIGHTS ESTRATÉGICOS:
         - Padrões de comportamento
         - Oportunidades detectadas
         - Riscos identificados
         - Correlações importantes
      
      4. ANÁLISE POR CANAL/PLATAFORMA:
         - Performance específica do ${validatedData.platform}
         - Comparação com outros canais
         - ROI por canal
         - Atribuição de conversões
      
      5. SEGMENTAÇÃO DE PÚBLICO:
         - Demografias que melhor converteram
         - Comportamentos de navegação
         - Jornada do cliente
         - Pontos de abandono
      
      6. RECOMENDAÇÕES ESTRATÉGICAS:
         - Ações imediatas (próximos 7 dias)
         - Táticas de médio prazo (30 dias)
         - Estratégias de longo prazo (90 dias)
         - Ajustes de orçamento
      
      7. PRÓXIMOS PASSOS:
         - Experimentos recomendados
         - Testes A/B sugeridos
         - Métricas para monitorar
         - Cronograma de revisões
      
      8. APÊNDICE:
         - Metodologia de cálculo
         - Fontes de dados
         - Limitações da análise
         - Definições de métricas
      
      Use visualizações de dados (descrições) quando apropriado e forneça insights acionáveis.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'analytics-report', 500, 0.010)

      return NextResponse.json({
        report: content,
        metadata: {
          platform: validatedData.platform,
          dateRange: validatedData.dateRange,
          metricsAnalyzed: Object.keys(validatedData.metrics).length,
          calculatedMetrics: derivedMetrics,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    if (action === 'analyze-performance') {
      const validatedData = performanceAnalysisSchema.parse(data)
      
      const totalBudget = validatedData.campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
      const totalSpent = validatedData.campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
      const totalImpressions = validatedData.campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
      const totalClicks = validatedData.campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
      const totalConversions = validatedData.campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
      const totalRevenue = validatedData.campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0)

      const prompt = `Analise a performance das campanhas em ${validatedData.timeframe}:
      
      CAMPANHAS ANALISADAS: ${validatedData.campaigns.length}
      
      RESUMO GERAL:
      - Orçamento total: R$ ${totalBudget.toLocaleString('pt-BR')}
      - Investimento total: R$ ${totalSpent.toLocaleString('pt-BR')}
      - Impressões totais: ${totalImpressions.toLocaleString('pt-BR')}
      - Cliques totais: ${totalClicks.toLocaleString('pt-BR')}
      - Conversões totais: ${totalConversions.toLocaleString('pt-BR')}
      ${totalRevenue > 0 ? `- Receita total: R$ ${totalRevenue.toLocaleString('pt-BR')}` : ''}
      
      OBJETIVOS: ${validatedData.objectives.join(', ')}
      KPIs PRINCIPAIS: ${validatedData.kpis.join(', ')}
      
      DETALHES POR CAMPANHA:
      ${validatedData.campaigns.map((campaign, index) => `
      ${index + 1}. ${campaign.name} (${campaign.platform})
         - Orçamento: R$ ${campaign.budget.toLocaleString('pt-BR')}
         - Investido: R$ ${campaign.spent.toLocaleString('pt-BR')}
         - Impressões: ${campaign.impressions.toLocaleString('pt-BR')}
         - Cliques: ${campaign.clicks.toLocaleString('pt-BR')}
         - Conversões: ${campaign.conversions}
         - CTR: ${((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
         - CPC: R$ ${(campaign.spent / campaign.clicks).toFixed(2)}
         - CPA: R$ ${(campaign.spent / campaign.conversions).toFixed(2)}
         ${campaign.revenue ? `- ROAS: ${(campaign.revenue / campaign.spent).toFixed(2)}x` : ''}
      `).join('')}
      
      Forneça uma análise completa:
      
      1. ANÁLISE GERAL DE PERFORMANCE:
         - Eficiência geral das campanhas
         - Utilização do orçamento
         - Atingimento dos objetivos
         - ROI consolidado
      
      2. RANKING DE CAMPANHAS:
         - Top 3 performers por conversão
         - Top 3 performers por ROAS
         - Campanhas com melhor CTR
         - Campanhas mais eficientes (CPA)
      
      3. ANÁLISE POR PLATAFORMA:
         - Performance por plataforma
         - Custos comparativos
         - Públicos que melhor respondem
         - Tipos de creative mais eficazes
      
      4. IDENTIFICAÇÃO DE PROBLEMAS:
         - Campanhas com baixa performance
         - Orçamentos mal distribuídos
         - Públicos não responsivos
         - Creativos que não convertem
      
      5. OPORTUNIDADES DE OTIMIZAÇÃO:
         - Realocar orçamento para winners
         - Pausar/ajustar campanhas ruins
         - Escalar campanhas eficientes
         - Testar novos públicos/creativos
      
      6. RECOMENDAÇÕES ESTRATÉGICAS:
         - Ajustes imediatos
         - Novos testes recomendados
         - Mudanças de estratégia
         - Projeções de performance
      
      7. PLANO DE AÇÃO:
         - Prioridades por impacto
         - Timeline de implementação
         - Recursos necessários
         - Métricas de acompanhamento
      
      8. PROJEÇÕES:
         - Performance esperada com otimizações
         - Potencial de crescimento
         - ROI projetado
         - Recomendações de budget
      
      Foque em insights acionáveis e oportunidades concretas de melhoria.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'performance-analysis', 600, 0.012)

      return NextResponse.json({
        analysis: content,
        summary: {
          totalCampaigns: validatedData.campaigns.length,
          totalBudget,
          totalSpent,
          budgetUtilization: parseFloat(((totalSpent / totalBudget) * 100).toFixed(2)),
          overallCTR: parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)),
          overallCPC: parseFloat((totalSpent / totalClicks).toFixed(2)),
          overallCPA: parseFloat((totalSpent / totalConversions).toFixed(2)),
          overallROAS: totalRevenue > 0 ? parseFloat((totalRevenue / totalSpent).toFixed(2)) : 0,
        },
        usage: {
          tokens: 600,
          cost: 0.012
        }
      })
    }

    if (action === 'predictive-analysis') {
      const validatedData = predictiveAnalysisSchema.parse(data)
      
      const dataPoints = validatedData.historicalData.length
      const latestDate = validatedData.historicalData[dataPoints - 1]?.date
      const latestValue = validatedData.historicalData[dataPoints - 1]?.value

      const prompt = `Faça uma análise preditiva para ${validatedData.predictMetric}:
      
      DADOS HISTÓRICOS:
      - Pontos de dados: ${dataPoints}
      - Período: ${validatedData.historicalData[0]?.date} a ${latestDate}
      - Valor mais recente: ${latestValue?.toLocaleString('pt-BR')}
      - Métrica: ${validatedData.predictMetric}
      
      PARÂMETROS DE PREVISÃO:
      - Período de previsão: ${validatedData.forecastPeriod} dias
      - Sazonalidade considerada: ${validatedData.seasonality ? 'Sim' : 'Não'}
      ${validatedData.currentTrends ? `- Tendências atuais: ${validatedData.currentTrends.join(', ')}` : ''}
      ${validatedData.externalFactors ? `- Fatores externos: ${validatedData.externalFactors.join(', ')}` : ''}
      
      DADOS PARA ANÁLISE:
      ${validatedData.historicalData.slice(-10).map(point => 
        `${point.date}: ${point.value.toLocaleString('pt-BR')}`
      ).join('\n')}
      
      Forneça uma análise preditiva completa:
      
      1. ANÁLISE DE TENDÊNCIAS:
         - Tendência geral identificada
         - Padrões sazonais detectados
         - Pontos de inflexão
         - Variabilidade dos dados
      
      2. PREVISÃO PARA ${validatedData.forecastPeriod} DIAS:
         - Cenário otimista (+20%)
         - Cenário realista (base)
         - Cenário pessimista (-20%)
         - Intervalos de confiança
      
      3. FATORES INFLUENCIADORES:
         - Variáveis internas identificadas
         - Impactos externos considerados
         - Sazonalidades previstas
         - Eventos que podem afetar
      
      4. ANÁLISE DE RISCO:
         - Probabilidade de atingir metas
         - Cenários de risco
         - Pontos de atenção
         - Indicadores de alerta
      
      5. RECOMENDAÇÕES ESTRATÉGICAS:
         - Ações para cenário otimista
         - Ações para cenário realista
         - Ações para cenário pessimista
         - Planos de contingência
      
      6. MONITORAMENTO:
         - KPIs para acompanhar
         - Frequência de revisão
         - Sinais de mudança de tendência
         - Ajustes de estratégia
      
      7. PROJEÇÕES DETALHADAS:
         - Breakdown semanal
         - Marcos importantes
         - Variações esperadas
         - Comparação com objetivos
      
      8. VALIDAÇÃO DO MODELO:
         - Acurácia esperada
         - Limitações da análise
         - Recomendações de dados adicionais
         - Melhorias futuras
      
      Base suas previsões em padrões históricos, tendências identificadas e fatores contextuais.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'predictive-analysis', 400, 0.008)

      return NextResponse.json({
        prediction: content,
        metadata: {
          metric: validatedData.predictMetric,
          forecastPeriod: validatedData.forecastPeriod,
          dataPoints,
          latestValue,
          seasonality: validatedData.seasonality,
        },
        usage: {
          tokens: 400,
          cost: 0.008
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "generate-report", "analyze-performance" ou "predictive-analysis"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro na análise de dados:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}