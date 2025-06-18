import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const blogGenerationSchema = z.object({
  topic: z.string().min(1, 'Tópico é obrigatório'),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal', 'conversational']).default('professional'),
  wordCount: z.number().min(100).max(3000).default(800),
  keywords: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  callToAction: z.string().optional(),
  includeImages: z.boolean().default(true),
})

const blogIdeasSchema = z.object({
  niche: z.string().min(1, 'Nicho é obrigatório'),
  quantity: z.number().min(1).max(20).default(10),
  targetAudience: z.string().optional(),
})

// POST /api/ai/blog - Gerar artigo de blog
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'generate-ideas') {
      const validatedData = blogIdeasSchema.parse(data)
      
      const prompt = `Gere ${validatedData.quantity} ideias de artigos de blog para o nicho: ${validatedData.niche}
      ${validatedData.targetAudience ? `Público-alvo: ${validatedData.targetAudience}` : ''}
      
      As ideias devem ser:
      - Atrativas e engajantes
      - Otimizadas para SEO
      - Relevantes para o público-alvo
      - Práticas e úteis
      
      Formato: Lista numerada com títulos chamativos`

      const content = await generateText(prompt, 'blog')
      await trackAIUsage(context.agencyId, 'blog-ideas', 150, 0.003)

      return NextResponse.json({
        ideas: content,
        usage: {
          tokens: 150,
          cost: 0.003
        }
      })
    }

    if (action === 'generate-article') {
      const validatedData = blogGenerationSchema.parse(data)
      
      const prompt = `Escreva um artigo de blog completo sobre: ${validatedData.topic}
      
      Especificações:
      - Tom: ${validatedData.tone}
      - Palavras: aproximadamente ${validatedData.wordCount}
      ${validatedData.keywords ? `- Palavras-chave: ${validatedData.keywords.join(', ')}` : ''}
      ${validatedData.targetAudience ? `- Público-alvo: ${validatedData.targetAudience}` : ''}
      ${validatedData.callToAction ? `- Call-to-action: ${validatedData.callToAction}` : ''}
      
      Estrutura obrigatória:
      1. Título SEO otimizado
      2. Introdução cativante
      3. Desenvolvimento com subtítulos (H2, H3)
      4. Conclusão
      5. Meta description (150-160 caracteres)
      ${validatedData.includeImages ? '6. Sugestões de imagens com alt text' : ''}
      
      O artigo deve ser informativo, bem estruturado e otimizado para SEO.`

      const content = await generateText(prompt, 'blog')
      const estimatedTokens = Math.ceil(validatedData.wordCount / 3)
      const estimatedCost = estimatedTokens * 0.00002

      await trackAIUsage(context.agencyId, 'blog-article', estimatedTokens, estimatedCost)

      return NextResponse.json({
        article: content,
        metadata: {
          topic: validatedData.topic,
          tone: validatedData.tone,
          wordCount: validatedData.wordCount,
          keywords: validatedData.keywords,
        },
        usage: {
          tokens: estimatedTokens,
          cost: estimatedCost
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "generate-ideas" ou "generate-article"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro na geração de blog:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}