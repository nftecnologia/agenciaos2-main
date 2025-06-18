import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const whatsappScriptSchema = z.object({
  type: z.enum(['cold_outreach', 'follow_up', 'sales_pitch', 'customer_service', 'appointment_booking']),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  tone: z.enum(['professional', 'casual', 'friendly', 'urgent']).default('friendly'),
  objective: z.string().min(1, 'Objetivo é obrigatório'),
  companyName: z.string().optional(),
  personalInfo: z.string().optional(),
})

const whatsappSequenceSchema = z.object({
  campaignName: z.string().min(1, 'Nome da campanha é obrigatório'),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  sequenceLength: z.number().min(1).max(10).default(5),
  daysBetween: z.number().min(1).max(30).default(3),
  objective: z.string().min(1, 'Objetivo é obrigatório'),
  companyName: z.string().optional(),
})

const whatsappTemplateSchema = z.object({
  industry: z.string().min(1, 'Setor é obrigatório'),
  templateType: z.enum(['welcome', 'promotion', 'reminder', 'survey', 'support']),
  businessType: z.enum(['ecommerce', 'services', 'restaurant', 'healthcare', 'education', 'beauty']),
  customization: z.string().optional(),
})

// POST /api/ai/whatsapp - Gerar conteúdo para WhatsApp Business
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'generate-script') {
      const validatedData = whatsappScriptSchema.parse(data)
      
      const prompt = `Crie um script de WhatsApp Business para ${validatedData.type}:
      
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Objetivo: ${validatedData.objective}
      Tom: ${validatedData.tone}
      ${validatedData.companyName ? `Empresa: ${validatedData.companyName}` : ''}
      ${validatedData.personalInfo ? `Informações pessoais: ${validatedData.personalInfo}` : ''}
      
      Requisitos:
      - Mensagem inicial impactante
      - Personalização com nome do cliente
      - Proposta de valor clara
      - Call-to-action específico
      - Alternativas para diferentes respostas
      - Linguagem natural e conversacional
      - Emojis estratégicos
      - Máximo 3 mensagens por sequência
      
      Inclua também:
      - Melhores horários para envio
      - Dicas de personalização
      - Variações da mensagem
      - Respostas para objeções comuns`

      const content = await generateText(prompt, 'whatsapp')
      await trackAIUsage(context.agencyId, 'whatsapp-script', 250, 0.005)

      return NextResponse.json({
        script: content,
        metadata: {
          type: validatedData.type,
          product: validatedData.product,
          targetAudience: validatedData.targetAudience,
          tone: validatedData.tone,
        },
        usage: {
          tokens: 250,
          cost: 0.005
        }
      })
    }

    if (action === 'create-sequence') {
      const validatedData = whatsappSequenceSchema.parse(data)
      
      const prompt = `Crie uma sequência de follow-up para WhatsApp Business:
      
      Campanha: ${validatedData.campaignName}
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Objetivo: ${validatedData.objective}
      Número de mensagens: ${validatedData.sequenceLength}
      Intervalo: ${validatedData.daysBetween} dias
      ${validatedData.companyName ? `Empresa: ${validatedData.companyName}` : ''}
      
      Crie uma sequência progressiva com:
      1. Mensagem inicial (introdução e valor)
      2. Mensagem de valor adicional
      3. Prova social/depoimentos
      4. Urgência/escassez
      5. Última chance/oferta especial
      
      Cada mensagem deve ter:
      - Objetivo específico
      - Tempo ideal de envio
      - Personalização
      - Call-to-action
      - Emojis relevantes
      - Alternativas para diferentes personas
      
      Inclua estratégias de segmentação e métricas de acompanhamento.`

      const content = await generateText(prompt, 'whatsapp')
      await trackAIUsage(context.agencyId, 'whatsapp-sequence', 400, 0.008)

      return NextResponse.json({
        sequence: content,
        metadata: {
          campaignName: validatedData.campaignName,
          sequenceLength: validatedData.sequenceLength,
          daysBetween: validatedData.daysBetween,
          product: validatedData.product,
        },
        usage: {
          tokens: 400,
          cost: 0.008
        }
      })
    }

    if (action === 'generate-templates') {
      const validatedData = whatsappTemplateSchema.parse(data)
      
      const prompt = `Crie templates de WhatsApp Business para ${validatedData.industry}:
      
      Tipo de negócio: ${validatedData.businessType}
      Tipo de template: ${validatedData.templateType}
      ${validatedData.customization ? `Personalização: ${validatedData.customization}` : ''}
      
      Crie 5 templates diferentes para ${validatedData.templateType}:
      
      Cada template deve incluir:
      - Header personalizado
      - Corpo da mensagem
      - Botões de ação
      - Variáveis de personalização
      - Emojis apropriados
      - Call-to-action claro
      
      Adapte para o setor ${validatedData.industry} e tipo de negócio ${validatedData.businessType}.
      
      Inclua dicas de:
      - Quando usar cada template
      - Como personalizar
      - Métricas de performance
      - Compliance com políticas do WhatsApp`

      const content = await generateText(prompt, 'whatsapp')
      await trackAIUsage(context.agencyId, 'whatsapp-templates', 350, 0.007)

      return NextResponse.json({
        templates: content,
        metadata: {
          industry: validatedData.industry,
          templateType: validatedData.templateType,
          businessType: validatedData.businessType,
        },
        usage: {
          tokens: 350,
          cost: 0.007
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "generate-script", "create-sequence" ou "generate-templates"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro na geração de conteúdo WhatsApp:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}