import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const audienceAnalysisSchema = z.object({
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  currentAudience: z.string().optional(),
  goals: z.array(z.string()).min(1, 'Pelo menos um objetivo é obrigatório'),
  budget: z.number().min(0).optional(),
  platforms: z.array(z.enum(['facebook', 'instagram', 'google', 'linkedin', 'tiktok', 'youtube'])),
  location: z.string().optional(),
})

const personaGeneratorSchema = z.object({
  businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetProblems: z.array(z.string()).min(1, 'Pelo menos um problema é obrigatório'),
  priceRange: z.string().min(1, 'Faixa de preço é obrigatória'),
  numberOfPersonas: z.number().min(1).max(5).default(3),
  includeDemographics: z.boolean().default(true),
  includePsychographics: z.boolean().default(true),
})

const competitorAnalysisSchema = z.object({
  businessNiche: z.string().min(1, 'Nicho é obrigatório'),
  competitors: z.array(z.string()).min(1, 'Pelo menos um concorrente é obrigatório'),
  analysisType: z.enum(['audience', 'content', 'strategy', 'pricing', 'complete']).default('complete'),
  platforms: z.array(z.string()).optional(),
})

// POST /api/ai/audience - Análise e segmentação de público
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'analyze-audience') {
      const validatedData = audienceAnalysisSchema.parse(data)
      
      const prompt = `Faça uma análise completa de público-alvo:
      
      Negócio: ${validatedData.businessType}
      Produto/Serviço: ${validatedData.product}
      Objetivos: ${validatedData.goals.join(', ')}
      Plataformas: ${validatedData.platforms.join(', ')}
      ${validatedData.currentAudience ? `Público atual: ${validatedData.currentAudience}` : ''}
      ${validatedData.budget ? `Orçamento: R$ ${validatedData.budget}` : ''}
      ${validatedData.location ? `Localização: ${validatedData.location}` : ''}
      
      Desenvolva uma análise abrangente de público:
      
      1. ANÁLISE DO PÚBLICO PRINCIPAL:
         - Demografia detalhada (idade, gênero, renda, educação)
         - Psicografia (valores, interesses, estilo de vida)
         - Comportamento online (plataformas, horários, conteúdo)
         - Jornada do cliente (awareness → consideration → decision)
      
      2. SEGMENTAÇÃO ESTRATÉGICA:
         - Público primário (80% do foco)
         - Público secundário (15% do foco)
         - Público terciário (5% do foco)
         - Nichos de oportunidade
      
      3. PERSONAS DETALHADAS:
         - 3 personas principais com:
           * Nome e foto imaginária
           * Background demográfico
           * Dores e necessidades
           * Objetivos e aspirações
           * Comportamento de compra
           * Canais preferidos
           * Objeções comuns
      
      4. ANÁLISE POR PLATAFORMA:
         ${validatedData.platforms.map(platform => `
         ${platform.toUpperCase()}:
         - Características do público nesta plataforma
         - Formatos de conteúdo que funcionam
         - Horários de maior engajamento
         - Estratégias de segmentação específicas
         `).join('')}
      
      5. ESTRATÉGIAS DE TARGETING:
         - Interesses para segmentação
         - Comportamentos de compra
         - Lookalike audiences
         - Custom audiences
         - Exclusões estratégicas
      
      6. ANÁLISE COMPORTAMENTAL:
         - Gatilhos de compra
         - Ciclo de decisão
         - Influenciadores
         - Sazonalidades
         - Padrões de consumo
      
      7. OPORTUNIDADES DE MERCADO:
         - Segmentos não atendidos
         - Nichos em crescimento
         - Tendências emergentes
         - Gaps da concorrência
      
      8. RECOMENDAÇÕES ESTRATÉGICAS:
         - Priorização de segmentos
         - Estratégias de aquisição
         - Táticas de retenção
         - Planos de expansão
         - Budget allocation
      
      9. MÉTRICAS E KPIs:
         - Indicadores de engajamento
         - Métricas de conversão
         - Lifetime value por segmento
         - Cost per acquisition
      
      10. PLANO DE TESTE:
          - Hipóteses para validar
          - Experimentos recomendados
          - Cronograma de testes
          - Critérios de sucesso
      
      Base a análise em dados de mercado e melhores práticas da indústria.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'audience-analysis', 600, 0.012)

      return NextResponse.json({
        analysis: content,
        metadata: {
          businessType: validatedData.businessType,
          platforms: validatedData.platforms,
          goals: validatedData.goals,
        },
        usage: {
          tokens: 600,
          cost: 0.012
        }
      })
    }

    if (action === 'generate-personas') {
      const validatedData = personaGeneratorSchema.parse(data)
      
      const prompt = `Crie ${validatedData.numberOfPersonas} personas detalhadas:
      
      Negócio: ${validatedData.businessType}
      Produto/Serviço: ${validatedData.product}
      Problemas que resolve: ${validatedData.targetProblems.join(', ')}
      Faixa de preço: ${validatedData.priceRange}
      
      Para cada persona, inclua:
      
      1. INFORMAÇÕES BÁSICAS:
         - Nome fictício
         - Idade
         - Profissão
         - Localização
         - Estado civil/família
         - Renda aproximada
      
      2. DEMOGRAFIA DETALHADA:
         ${validatedData.includeDemographics ? `
         - Escolaridade
         - Composição familiar
         - Tipo de moradia
         - Meio de transporte
         - Poder de compra
         ` : 'Foco nos aspectos comportamentais'}
      
      3. PSICOGRAFIA COMPLETA:
         ${validatedData.includePsychographics ? `
         - Valores pessoais
         - Interesses e hobbies
         - Estilo de vida
         - Personalidade
         - Medos e aspirações
         - Influenciadores
         ` : 'Foco nos aspectos demográficos'}
      
      4. COMPORTAMENTO DIGITAL:
         - Plataformas que usa
         - Horários online
         - Tipos de conteúdo que consome
         - Influenciadores que segue
         - Marcas que admira
      
      5. RELAÇÃO COM O PRODUTO:
         - Principal dor que o produto resolve
         - Benefício mais valorizado
         - Objeções principais
         - Processo de decisão
         - Fatores de compra
         - Gatilhos de urgência
      
      6. JORNADA DO CLIENTE:
         - Como descobre produtos
         - Onde pesquisa informações
         - Quem influencia sua decisão
         - Onde prefere comprar
         - Pós-compra expectations
      
      7. ESTRATÉGIAS DE COMUNICAÇÃO:
         - Tom de voz ideal
         - Canais preferidos
         - Formatos de conteúdo
         - Momento ideal para abordar
         - Mensagens que ressoam
      
      8. CENÁRIOS DE USO:
         - Quando usaria o produto
         - Como usaria
         - Com que frequência
         - Em que contexto
         - Que resultado espera
      
      Para cada persona, crie também:
      - Um dia típico na vida dela
      - Quote representativo
      - Frustrações principais
      - Objetivos de vida
      - Como medir sucesso com ela
      
      Torne as personas realistas e acionáveis para estratégias de marketing.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'persona-generator', 500, 0.010)

      return NextResponse.json({
        personas: content,
        metadata: {
          numberOfPersonas: validatedData.numberOfPersonas,
          businessType: validatedData.businessType,
          priceRange: validatedData.priceRange,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    if (action === 'competitor-analysis') {
      const validatedData = competitorAnalysisSchema.parse(data)
      
      const analysisTypes = {
        audience: 'Análise focada no público-alvo dos concorrentes',
        content: 'Análise da estratégia de conteúdo',
        strategy: 'Análise da estratégia geral de marketing',
        pricing: 'Análise de preços e posicionamento',
        complete: 'Análise completa de todos os aspectos'
      }

      const prompt = `Faça uma análise competitiva detalhada:
      
      Nicho: ${validatedData.businessNiche}
      Concorrentes: ${validatedData.competitors.join(', ')}
      Tipo de análise: ${validatedData.analysisType} (${analysisTypes[validatedData.analysisType]})
      ${validatedData.platforms ? `Plataformas: ${validatedData.platforms.join(', ')}` : ''}
      
      Desenvolva uma análise competitiva abrangente:
      
      ${validatedData.analysisType === 'audience' || validatedData.analysisType === 'complete' ? `
      1. ANÁLISE DE PÚBLICO:
         Para cada concorrente:
         - Quem é o público-alvo principal
         - Demographics e psychographics
         - Tamanho da audiência estimado
         - Engajamento médio
         - Crescimento de followers
         - Personas que atendem
         - Lacunas no atendimento
      ` : ''}
      
      ${validatedData.analysisType === 'content' || validatedData.analysisType === 'complete' ? `
      2. ESTRATÉGIA DE CONTEÚDO:
         Para cada concorrente:
         - Pilares de conteúdo
         - Frequência de posts
         - Formatos mais usados
         - Tom de voz e linguagem
         - Temas que mais engajam
         - Horários de publicação
         - Uso de trends
         - Qualidade visual
      ` : ''}
      
      ${validatedData.analysisType === 'strategy' || validatedData.analysisType === 'complete' ? `
      3. ESTRATÉGIA DE MARKETING:
         Para cada concorrente:
         - Canais principais
         - Estratégias de aquisição
         - Campanhas recentes
         - Parcerias e colaborações
         - Eventos e ativações
         - PR e mídia espontânea
         - Programa de afiliados
      ` : ''}
      
      ${validatedData.analysisType === 'pricing' || validatedData.analysisType === 'complete' ? `
      4. ANÁLISE DE PREÇOS:
         Para cada concorrente:
         - Estrutura de preços
         - Posicionamento (premium/acessível)
         - Ofertas e promoções
         - Pacotes e bundles
         - Formas de pagamento
         - Garantias oferecidas
         - Valor percebido
      ` : ''}
      
      ${validatedData.analysisType === 'complete' ? `
      5. PONTOS FORTES E FRACOS:
         Para cada concorrente:
         - Principais diferenciais
         - Pontos fortes únicos
         - Fraquezas identificadas
         - Vulnerabilidades
         - Oportunidades perdidas
      
      6. POSICIONAMENTO NO MERCADO:
         - Market share estimado
         - Posição competitiva
         - Reputation score
         - Força da marca
         - Loyalty da audiência
      ` : ''}
      
      7. OPORTUNIDADES IDENTIFICADAS:
         - Gaps no mercado
         - Públicos mal atendidos
         - Conteúdos não explorados
         - Canais subutilizados
         - Preços mal posicionados
         - Necessidades não atendidas
      
      8. AMEAÇAS COMPETITIVAS:
         - Concorrentes dominantes
         - Novos entrantes
         - Mudanças de mercado
         - Inovações disruptivas
         - Movimentos competitivos
      
      9. BENCHMARKING:
         - Melhores práticas identificadas
         - Métricas de referência
         - Standards da indústria
         - Inovações interessantes
      
      10. RECOMENDAÇÕES ESTRATÉGICAS:
          - Como se diferenciar
          - Onde competir
          - Onde evitar competição direta
          - Nichos para explorar
          - Estratégias de blue ocean
          - Táticas de guerrilha
      
      11. PLANO DE MONITORAMENTO:
          - KPIs para acompanhar
          - Ferramentas recomendadas
          - Frequência de análise
          - Alertas competitivos
      
      Base a análise em dados públicos disponíveis e tendências do setor.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'competitor-analysis', 450, 0.009)

      return NextResponse.json({
        analysis: content,
        metadata: {
          businessNiche: validatedData.businessNiche,
          competitors: validatedData.competitors,
          analysisType: validatedData.analysisType,
        },
        usage: {
          tokens: 450,
          cost: 0.009
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "analyze-audience", "generate-personas" ou "competitor-analysis"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro na análise de público:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}