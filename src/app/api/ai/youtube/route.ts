import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const youtubeScriptSchema = z.object({
  topic: z.string().min(1, 'Tópico é obrigatório'),
  duration: z.enum(['short', 'medium', 'long']), // 1-3min, 5-10min, 15-30min
  style: z.enum(['educational', 'entertainment', 'review', 'tutorial', 'vlog']),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  tone: z.enum(['professional', 'casual', 'energetic', 'calm', 'funny']).default('casual'),
  includeHooks: z.boolean().default(true),
  callToAction: z.string().optional(),
})

const youtubeOptimizationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  videoTopic: z.string().min(1, 'Tópico do vídeo é obrigatório'),
  targetKeywords: z.array(z.string()).min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  targetAudience: z.string().optional(),
})

const youtubeStrategySchema = z.object({
  channelNiche: z.string().min(1, 'Nicho do canal é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  contentGoals: z.array(z.string()).min(1, 'Pelo menos um objetivo é obrigatório'),
  uploadFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']).default('weekly'),
  channelSize: z.enum(['new', 'small', 'medium', 'large']).default('new'),
  competitorChannels: z.array(z.string()).optional(),
})

// POST /api/ai/youtube - Ferramentas para YouTube
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create-script') {
      const validatedData = youtubeScriptSchema.parse(data)
      
      const durationsMap = {
        short: '1-3 minutos (ideal para Shorts)',
        medium: '5-10 minutos',
        long: '15-30 minutos'
      }

      const prompt = `Crie um roteiro completo para YouTube:
      
      Tópico: ${validatedData.topic}
      Duração: ${durationsMap[validatedData.duration]}
      Estilo: ${validatedData.style}
      Público-alvo: ${validatedData.targetAudience}
      Tom: ${validatedData.tone}
      ${validatedData.callToAction ? `Call-to-action: ${validatedData.callToAction}` : ''}
      
      Estruture o roteiro com:
      
      1. HOOK (primeiros 15 segundos):
         ${validatedData.includeHooks ? '- 3 variações de abertura impactante\n- Promessa de valor clara\n- Elemento de curiosidade' : '- Abertura direta ao tema'}
      
      2. INTRODUÇÃO (15-30 segundos):
         - Apresentação do criador
         - Preview do que será mostrado
         - Pedido de like/inscrição
      
      3. DESENVOLVIMENTO:
         ${validatedData.style === 'tutorial' ? '- Passo a passo detalhado\n- Demonstrações práticas\n- Dicas extras' : ''}
         ${validatedData.style === 'educational' ? '- Conceitos principais\n- Exemplos práticos\n- Aplicações' : ''}
         ${validatedData.style === 'review' ? '- Análise detalhada\n- Prós e contras\n- Comparações' : ''}
         ${validatedData.style === 'entertainment' ? '- Narrativa envolvente\n- Momentos de humor\n- Elementos visuais' : ''}
         - Transições naturais entre tópicos
         - Momentos de engajamento
      
      4. CONCLUSÃO:
         - Resumo dos pontos principais
         - Call-to-action principal
         - Próximos passos
      
      5. ENCERRAMENTO:
         - Pedido de engajamento
         - Sugestão de próximo vídeo
         - Despedida
      
      Inclua também:
      - Timing detalhado para cada seção
      - Sugestões de B-roll e elementos visuais
      - Pontos de destaque para edição
      - Momentos para gráficos/texto na tela
      - Sugestões de thumbnail
      - Palavras-chave para SEO
      
      Adapte o roteiro para ${validatedData.duration === 'short' ? 'formato vertical (9:16)' : 'formato horizontal (16:9)'}.`

      const content = await generateText(prompt, 'blog')
      await trackAIUsage(context.agencyId, 'youtube-script', 400, 0.008)

      return NextResponse.json({
        script: content,
        metadata: {
          topic: validatedData.topic,
          duration: validatedData.duration,
          style: validatedData.style,
          tone: validatedData.tone,
        },
        usage: {
          tokens: 400,
          cost: 0.008
        }
      })
    }

    if (action === 'optimize-video') {
      const validatedData = youtubeOptimizationSchema.parse(data)
      
      const prompt = `Otimize completamente este vídeo do YouTube para SEO e engajamento:
      
      Título atual: ${validatedData.title}
      Tópico: ${validatedData.videoTopic}
      Palavras-chave: ${validatedData.targetKeywords.join(', ')}
      Duração: ${validatedData.duration}
      Categoria: ${validatedData.category}
      ${validatedData.targetAudience ? `Público-alvo: ${validatedData.targetAudience}` : ''}
      
      Forneça otimizações completas:
      
      1. TÍTULOS OTIMIZADOS:
         - 5 variações do título (máximo 60 caracteres)
         - Incluir palavras-chave principais
         - Elementos de curiosidade/urgência
         - Números e listas quando aplicável
      
      2. DESCRIÇÃO COMPLETA:
         - Primeira linha impactante (125 caracteres)
         - Resumo do vídeo
         - Timestamps detalhados
         - Links relevantes
         - Call-to-actions
         - Hashtags estratégicas
         - Palavras-chave naturalmente integradas
      
      3. TAGS ESTRATÉGICAS:
         - 15-20 tags relevantes
         - Mix de tags específicas e amplas
         - Palavras-chave de cauda longa
         - Tags de tendência
      
      4. THUMBNAIL:
         - 3 conceitos diferentes
         - Elementos visuais impactantes
         - Cores que se destacam
         - Texto legível (máximo 3 palavras)
         - Expressões faciais
      
      5. CARDS E END SCREENS:
         - Momentos ideais para cards
         - Sugestões de vídeos relacionados
         - Call-to-actions para inscrição
      
      6. ESTRATÉGIA DE PUBLICAÇÃO:
         - Melhor horário de upload
         - Dia da semana ideal
         - Estratégia de promoção
      
      7. ENGAJAMENTO:
         - Perguntas para comentários
         - Elementos interativos
         - Community posts relacionados
      
      8. ANÁLISE COMPETITIVA:
         - Comparação com vídeos similares
         - Oportunidades de diferenciação
         - Lacunas no mercado`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'youtube-optimization', 350, 0.007)

      return NextResponse.json({
        optimization: content,
        metadata: {
          title: validatedData.title,
          targetKeywords: validatedData.targetKeywords,
          category: validatedData.category,
        },
        usage: {
          tokens: 350,
          cost: 0.007
        }
      })
    }

    if (action === 'create-strategy') {
      const validatedData = youtubeStrategySchema.parse(data)
      
      const prompt = `Crie uma estratégia completa de crescimento para YouTube:
      
      Nicho: ${validatedData.channelNiche}
      Público-alvo: ${validatedData.targetAudience}
      Objetivos: ${validatedData.contentGoals.join(', ')}
      Frequência: ${validatedData.uploadFrequency}
      Tamanho do canal: ${validatedData.channelSize}
      ${validatedData.competitorChannels ? `Concorrentes: ${validatedData.competitorChannels.join(', ')}` : ''}
      
      Desenvolva uma estratégia abrangente:
      
      1. ANÁLISE DO NICHO:
         - Oportunidades de mercado
         - Concorrência direta e indireta
         - Lacunas de conteúdo
         - Tendências emergentes
      
      2. ESTRATÉGIA DE CONTEÚDO:
         - Pilares de conteúdo (4-5 pilares)
         - Tipos de vídeo por pilar
         - Calendário editorial mensal
         - Sazonalidade e eventos
         - Série de vídeos
      
      3. OTIMIZAÇÃO DO CANAL:
         - Arte do canal profissional
         - Descrição otimizada
         - Organização em playlists
         - Trailer do canal
         - Seções em destaque
      
      4. ESTRATÉGIA DE CRESCIMENTO:
         - Táticas para novos inscritos
         - Colaborações estratégicas
         - Cross-promotion
         - Shorts vs vídeos longos
         - Live streams
      
      5. MONETIZAÇÃO:
         - Requisitos para monetização
         - Múltiplas fontes de receita
         - Parcerias e patrocínios
         - Produtos próprios
         - Memberships
      
      6. ENGAJAMENTO:
         - Estratégias para comentários
         - Community posts
         - Interação com audiência
         - Resposta a tendências
      
      7. MÉTRICAS E KPIs:
         - Indicadores de crescimento
         - Metas mensais/trimestrais
         - Ferramentas de análise
         - Relatórios de performance
      
      8. CRONOGRAMA DE 90 DIAS:
         - Primeiros 30 dias
         - Dias 31-60
         - Dias 61-90
         - Marcos importantes
      
      Adapte a estratégia para canais ${validatedData.channelSize}.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'youtube-strategy', 500, 0.010)

      return NextResponse.json({
        strategy: content,
        metadata: {
          channelNiche: validatedData.channelNiche,
          uploadFrequency: validatedData.uploadFrequency,
          channelSize: validatedData.channelSize,
          contentGoals: validatedData.contentGoals,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "create-script", "optimize-video" ou "create-strategy"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro nas ferramentas do YouTube:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}