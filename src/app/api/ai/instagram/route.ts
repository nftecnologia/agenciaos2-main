import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const instagramGenerationSchema = z.object({
  type: z.enum(['post', 'story', 'reel', 'carousel']),
  topic: z.string().min(1, 'Tópico é obrigatório'),
  tone: z.enum(['professional', 'casual', 'inspiring', 'funny', 'educational']).default('casual'),
  hashtags: z.number().min(5).max(30).default(15),
  includeEmojis: z.boolean().default(true),
  targetAudience: z.string().optional(),
  callToAction: z.string().optional(),
  brandVoice: z.string().optional(),
})

const instagramPlannerSchema = z.object({
  niche: z.string().min(1, 'Nicho é obrigatório'),
  postsPerWeek: z.number().min(1).max(21).default(7),
  duration: z.number().min(1).max(4).default(1), // semanas
  contentTypes: z.array(z.enum(['post', 'story', 'reel', 'carousel'])).default(['post', 'story', 'reel']),
  targetAudience: z.string().optional(),
})

// POST /api/ai/instagram - Gerar conteúdo para Instagram  
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'generate-content') {
      const validatedData = instagramGenerationSchema.parse(data)
      
      const prompt = `Crie um ${validatedData.type} para Instagram sobre: ${validatedData.topic}
      
      Especificações:
      - Tom: ${validatedData.tone}
      - Incluir ${validatedData.hashtags} hashtags relevantes
      ${validatedData.includeEmojis ? '- Usar emojis de forma estratégica' : '- Sem emojis'}
      ${validatedData.targetAudience ? `- Público-alvo: ${validatedData.targetAudience}` : ''}
      ${validatedData.callToAction ? `- Call-to-action: ${validatedData.callToAction}` : ''}
      ${validatedData.brandVoice ? `- Tom de marca: ${validatedData.brandVoice}` : ''}
      
      Requisitos para ${validatedData.type}:
      ${validatedData.type === 'post' ? '- Texto envolvente (máximo 2200 caracteres)\n- Primeira linha impactante' : ''}
      ${validatedData.type === 'story' ? '- Texto curto e direto\n- Foco na interação' : ''}
      ${validatedData.type === 'reel' ? '- Script com hook, desenvolvimento e CTA\n- Sugestões de transições' : ''}
      ${validatedData.type === 'carousel' ? '- Texto principal + 5-10 slides\n- Conteúdo educativo/informativo' : ''}
      
      Inclua também sugestões de horário de postagem e engajamento.`

      const content = await generateText(prompt, 'instagram')
      await trackAIUsage(context.agencyId, 'instagram-content', 200, 0.004)

      return NextResponse.json({
        content,
        metadata: {
          type: validatedData.type,
          topic: validatedData.topic,
          tone: validatedData.tone,
          hashtags: validatedData.hashtags,
        },
        usage: {
          tokens: 200,
          cost: 0.004
        }
      })
    }

    if (action === 'create-content-plan') {
      const validatedData = instagramPlannerSchema.parse(data)
      
      const totalPosts = validatedData.postsPerWeek * validatedData.duration
      
      const prompt = `Crie um plano de conteúdo para Instagram:
      
      Nicho: ${validatedData.niche}
      Duração: ${validatedData.duration} semana(s)
      Posts por semana: ${validatedData.postsPerWeek}
      Total de posts: ${totalPosts}
      Tipos de conteúdo: ${validatedData.contentTypes.join(', ')}
      ${validatedData.targetAudience ? `Público-alvo: ${validatedData.targetAudience}` : ''}
      
      Estruture o plano com:
      1. Cronograma semanal detalhado
      2. Temas para cada post
      3. Tipos de conteúdo por dia
      4. Sugestões de hashtags por tema
      5. Melhores horários para postar
      6. Ideias de stories para cada dia
      7. Estratégias de engajamento
      8. Métricas para acompanhar
      
      Organize por semanas e dias da semana.`

      const content = await generateText(prompt, 'instagram')
      await trackAIUsage(context.agencyId, 'instagram-planner', 300, 0.006)

      return NextResponse.json({
        plan: content,
        metadata: {
          niche: validatedData.niche,
          duration: validatedData.duration,
          totalPosts,
          postsPerWeek: validatedData.postsPerWeek,
        },
        usage: {
          tokens: 300,
          cost: 0.006
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "generate-content" ou "create-content-plan"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro na geração de conteúdo Instagram:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}