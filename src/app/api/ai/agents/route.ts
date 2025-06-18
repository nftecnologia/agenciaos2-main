import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { applyRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

const listAgentsSchema = z.object({
  category: z.enum(['content', 'marketing', 'analytics', 'automation', 'all']).default('all'),
})

const agentUsageSchema = z.object({
  agentId: z.string(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// GET /api/ai/agents - Listar todos os agentes de IA disponíveis
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'

    const agents = [
      // Content Creation Agents
      {
        id: 'blog-writer',
        name: 'Redator de Blog',
        description: 'Cria artigos de blog otimizados para SEO e engajamento',
        category: 'content',
        endpoint: '/api/ai/blog',
        features: [
          'Geração de ideias de artigos',
          'Criação de artigos completos',
          'Otimização SEO automática',
          'Múltiplos tons de voz',
          'Estruturação profissional'
        ],
        pricing: {
          baseTokens: 100,
          baseCost: 0.002,
          maxTokens: 3000
        },
        icon: '📝',
        color: '#3B82F6'
      },
      {
        id: 'instagram-manager',
        name: 'Gerenciador Instagram',
        description: 'Cria conteúdo otimizado para Instagram e planejamento de posts',
        category: 'content',
        endpoint: '/api/ai/instagram',
        features: [
          'Posts para feed',
          'Stories criativos',
          'Scripts para Reels',
          'Carroseis informativos',
          'Planejamento de conteúdo',
          'Hashtags estratégicas'
        ],
        pricing: {
          baseTokens: 150,
          baseCost: 0.003,
          maxTokens: 1500
        },
        icon: '📸',
        color: '#E1306C'
      },
      {
        id: 'whatsapp-assistant',
        name: 'Assistente WhatsApp',
        description: 'Cria scripts e sequências para WhatsApp Business',
        category: 'marketing',
        endpoint: '/api/ai/whatsapp',
        features: [
          'Scripts de abordagem',
          'Sequências de follow-up',
          'Templates de negócio',
          'Automação de vendas',
          'Atendimento ao cliente'
        ],
        pricing: {
          baseTokens: 200,
          baseCost: 0.004,
          maxTokens: 2000
        },
        icon: '💬',
        color: '#25D366'
      },
      {
        id: 'seo-optimizer',
        name: 'Otimizador SEO',
        description: 'Otimiza conteúdo para mecanismos de busca',
        category: 'marketing',
        endpoint: '/api/ai/seo',
        features: [
          'Análise de páginas',
          'Pesquisa de palavras-chave',
          'Otimização de conteúdo',
          'Auditoria técnica',
          'Estratégias de link building'
        ],
        pricing: {
          baseTokens: 300,
          baseCost: 0.006,
          maxTokens: 2500
        },
        icon: '🔍',
        color: '#10B981'
      },
      {
        id: 'funnel-creator',
        name: 'Criador de Funis',
        description: 'Desenvolve funis de vendas completos e landing pages',
        category: 'marketing',
        endpoint: '/api/ai/funnel',
        features: [
          'Funis de vendas completos',
          'Landing pages otimizadas',
          'Sequências de e-mail',
          'Estratégias de conversão',
          'Análise de performance'
        ],
        pricing: {
          baseTokens: 400,
          baseCost: 0.008,
          maxTokens: 4000
        },
        icon: '🚀',
        color: '#8B5CF6'
      },
      {
        id: 'youtube-strategist',
        name: 'Estrategista YouTube',
        description: 'Cria estratégias e conteúdo para YouTube',
        category: 'content',
        endpoint: '/api/ai/youtube',
        features: [
          'Scripts de vídeo',
          'Otimização de títulos',
          'Estratégias de canal',
          'Planejamento de conteúdo',
          'Análise de concorrência'
        ],
        pricing: {
          baseTokens: 350,
          baseCost: 0.007,
          maxTokens: 3000
        },
        icon: '🎥',
        color: '#FF0000'
      },
      {
        id: 'ads-manager',
        name: 'Gerenciador de Anúncios',
        description: 'Cria e otimiza campanhas de anúncios pagos',
        category: 'marketing',
        endpoint: '/api/ai/ads',
        features: [
          'Creativos de anúncios',
          'Estratégias de campanha',
          'Otimização de performance',
          'Análise competitiva',
          'Budget allocation'
        ],
        pricing: {
          baseTokens: 400,
          baseCost: 0.008,
          maxTokens: 3500
        },
        icon: '📢',
        color: '#F59E0B'
      },
      {
        id: 'copywriter',
        name: 'Copywriter IA',
        description: 'Cria copy persuasivo para vendas e marketing',
        category: 'content',
        endpoint: '/api/ai/copywriting',
        features: [
          'Copy de vendas',
          'Headlines impactantes',
          'E-mails persuasivos',
          'Descrições de produtos',
          'CTAs otimizados'
        ],
        pricing: {
          baseTokens: 250,
          baseCost: 0.005,
          maxTokens: 2500
        },
        icon: '✍️',
        color: '#EC4899'
      },
      {
        id: 'data-analyst',
        name: 'Analista de Dados',
        description: 'Analisa dados e gera insights acionáveis',
        category: 'analytics',
        endpoint: '/api/ai/analytics',
        features: [
          'Relatórios automatizados',
          'Análise de performance',
          'Previsões de dados',
          'Insights estratégicos',
          'Dashboards inteligentes'
        ],
        pricing: {
          baseTokens: 500,
          baseCost: 0.010,
          maxTokens: 4000
        },
        icon: '📊',
        color: '#6366F1'
      }
    ]

    const filteredAgents = category === 'all' 
      ? agents 
      : agents.filter(agent => agent.category === category)

    // Buscar uso dos agentes para esta agência
    const agentUsage = await prisma.aIUsage.groupBy({
      by: ['agentType'],
      where: {
        agencyId: context.agencyId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
        }
      },
      _sum: {
        tokensUsed: true,
        cost: true
      },
      _count: {
        id: true
      }
    })

    // Adicionar dados de uso aos agentes
    const agentsWithUsage = filteredAgents.map(agent => {
      const usage = agentUsage.find(u => u.agentType === agent.id)
      return {
        ...agent,
        usage: {
          totalUses: usage?._count.id || 0,
          totalTokens: usage?._sum.tokensUsed || 0,
          totalCost: usage?._sum.cost || 0,
          avgCostPerUse: usage?._count.id ? (usage._sum.cost || 0) / usage._count.id : 0
        }
      }
    })

    return NextResponse.json({
      agents: agentsWithUsage,
      totalAgents: filteredAgents.length,
      categories: ['content', 'marketing', 'analytics', 'automation'],
      summary: {
        totalMonthlyUses: agentUsage.reduce((sum, usage) => sum + (usage._count.id || 0), 0),
        totalMonthlyTokens: agentUsage.reduce((sum, usage) => sum + (usage._sum.tokensUsed || 0), 0),
        totalMonthlyCost: agentUsage.reduce((sum, usage) => sum + (usage._sum.cost || 0), 0)
      }
    })

  } catch (error) {
    console.error('Erro ao listar agentes:', error)
    
    // Return fallback agents list on error
    return NextResponse.json({
      agents: [],
      totalAgents: 0,
      categories: ['content', 'marketing', 'analytics', 'automation'],
      summary: {
        totalMonthlyUses: 0,
        totalMonthlyTokens: 0,
        totalMonthlyCost: 0
      }
    })
  }
}

// POST /api/ai/agents - Obter dados de uso de um agente específico
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const validatedData = agentUsageSchema.parse(body)

    const startDate = validatedData.startDate 
      ? new Date(validatedData.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const endDate = validatedData.endDate 
      ? new Date(validatedData.endDate)
      : new Date()

    // Buscar histórico de uso do agente
    const usageHistory = await prisma.aIUsage.findMany({
      where: {
        agencyId: context.agencyId,
        agentType: validatedData.agentId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    })

    // Agrupar por dia para mostrar tendências
    const dailyUsage = usageHistory.reduce((acc, usage) => {
      const date = usage.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          uses: 0,
          tokens: 0,
          cost: 0
        }
      }
      acc[date].uses += 1
      acc[date].tokens += usage.tokensUsed
      acc[date].cost += usage.cost
      return acc
    }, {} as Record<string, any>)

    const dailyData = Object.values(dailyUsage).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Calcular estatísticas
    const totalUses = usageHistory.length
    const totalTokens = usageHistory.reduce((sum, usage) => sum + usage.tokensUsed, 0)
    const totalCost = usageHistory.reduce((sum, usage) => sum + usage.cost, 0)
    const avgTokensPerUse = totalUses > 0 ? totalTokens / totalUses : 0
    const avgCostPerUse = totalUses > 0 ? totalCost / totalUses : 0

    // Encontrar picos de uso
    const peakUsage = dailyData.reduce((peak: any, day: any) => 
      day.uses > (peak?.uses || 0) ? day : peak, null
    )

    return NextResponse.json({
      agentId: validatedData.agentId,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      summary: {
        totalUses,
        totalTokens,
        totalCost: parseFloat(totalCost.toFixed(4)),
        avgTokensPerUse: parseFloat(avgTokensPerUse.toFixed(1)),
        avgCostPerUse: parseFloat(avgCostPerUse.toFixed(4))
      },
      dailyUsage: dailyData,
      peakUsage,
      recentUsage: usageHistory.slice(0, 10).map(usage => ({
        id: usage.id,
        timestamp: usage.createdAt.toISOString(),
        tokens: usage.tokensUsed,
        cost: usage.cost
      }))
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao buscar dados de uso do agente:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}