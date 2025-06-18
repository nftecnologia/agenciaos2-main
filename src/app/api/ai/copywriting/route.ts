import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const copywritingSchema = z.object({
  type: z.enum(['sales_page', 'email', 'ad_copy', 'social_media', 'headline', 'product_description', 'cta']),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  tone: z.enum(['professional', 'casual', 'friendly', 'urgent', 'authoritative', 'playful']).default('professional'),
  framework: z.enum(['AIDA', 'PAS', 'BEFORE_AFTER', 'PROBLEM_SOLUTION', 'STORY', 'FEATURES_BENEFITS']).optional(),
  keyBenefits: z.array(z.string()).min(1, 'Pelo menos um benefício é obrigatório'),
  painPoints: z.array(z.string()).optional(),
  socialProof: z.string().optional(),
  callToAction: z.string().optional(),
  urgency: z.string().optional(),
})

const headlineGeneratorSchema = z.object({
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  mainBenefit: z.string().min(1, 'Principal benefício é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  type: z.enum(['curiosity', 'benefit', 'question', 'how_to', 'number', 'urgency', 'social_proof']),
  platform: z.enum(['website', 'email', 'social_media', 'ad', 'landing_page']).default('website'),
  keywords: z.array(z.string()).optional(),
})

const emailCopySchema = z.object({
  emailType: z.enum(['welcome', 'sales', 'nurture', 'cart_abandonment', 'reactivation', 'newsletter']),
  product: z.string().min(1, 'Produto/serviço é obrigatório'),
  targetAudience: z.string().min(1, 'Público-alvo é obrigatório'),
  tone: z.enum(['professional', 'casual', 'friendly', 'urgent']).default('friendly'),
  personalizedData: z.object({
    firstName: z.string().optional(),
    companyName: z.string().optional(),
    lastPurchase: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
  objective: z.string().min(1, 'Objetivo do e-mail é obrigatório'),
})

// POST /api/ai/copywriting - Gerador de copy persuasivo
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'generate-copy') {
      const validatedData = copywritingSchema.parse(data)
      
      const frameworkGuides = {
        AIDA: 'Attention (Atenção) → Interest (Interesse) → Desire (Desejo) → Action (Ação)',
        PAS: 'Problem (Problema) → Agitate (Agitar) → Solution (Solução)',
        BEFORE_AFTER: 'Situação atual problemática → Situação ideal após solução',
        PROBLEM_SOLUTION: 'Identificar problema → Apresentar solução clara',
        STORY: 'Narrativa envolvente → Conexão emocional → Resolução',
        FEATURES_BENEFITS: 'Características técnicas → Benefícios práticos → Valor'
      }

      const prompt = `Crie um copy persuasivo para ${validatedData.type}:
      
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Tom: ${validatedData.tone}
      ${validatedData.framework ? `Framework: ${validatedData.framework} (${frameworkGuides[validatedData.framework]})` : ''}
      Benefícios principais: ${validatedData.keyBenefits.join(', ')}
      ${validatedData.painPoints ? `Dores do público: ${validatedData.painPoints.join(', ')}` : ''}
      ${validatedData.socialProof ? `Prova social: ${validatedData.socialProof}` : ''}
      ${validatedData.callToAction ? `CTA desejado: ${validatedData.callToAction}` : ''}
      ${validatedData.urgency ? `Urgência: ${validatedData.urgency}` : ''}
      
      Crie um copy otimizado seguindo as melhores práticas:
      
      1. ESTRUTURA PERSUASIVA:
         ${validatedData.framework ? `- Seguir framework ${validatedData.framework}` : '- Estrutura lógica de persuasão'}
         - Abrir com hook impactante
         - Desenvolver argumentos fortes
         - Fechar com CTA irresistível
      
      2. ELEMENTOS ESPECÍFICOS PARA ${validatedData.type.toUpperCase()}:
         ${validatedData.type === 'sales_page' ? '- Headline principal + subheadline\n- Seções de benefícios\n- Prova social\n- Objeções\n- Garantia\n- CTAs múltiplos' : ''}
         ${validatedData.type === 'email' ? '- Subject line impactante\n- Preview text\n- Abertura personalizada\n- Corpo persuasivo\n- CTA claro' : ''}
         ${validatedData.type === 'ad_copy' ? '- Headlines variados\n- Descrições curtas\n- CTAs de ação\n- Adaptado para plataforma' : ''}
         ${validatedData.type === 'social_media' ? '- Hook nos primeiros 3 segundos\n- Conteúdo visual\n- Hashtags estratégicas\n- Engajamento' : ''}
         ${validatedData.type === 'headline' ? '- Múltiplas variações\n- Diferentes abordagens\n- Testes A/B sugeridos' : ''}
         ${validatedData.type === 'product_description' ? '- Benefícios vs características\n- SEO otimizado\n- Scannable\n- Compradores ideais' : ''}
         ${validatedData.type === 'cta' ? '- Orientado à ação\n- Senso de urgência\n- Benefício claro\n- Múltiplas variações' : ''}
      
      3. TÉCNICAS PSICOLÓGICAS:
         - Princípios de Cialdini aplicados
         - Gatilhos mentais relevantes
         - Storytelling quando apropriado
         - Objeções antecipadas
         - Prova social integrada
      
      4. OTIMIZAÇÕES:
         - Palavras de poder
         - Números específicos
         - Benefícios tangíveis
         - Linguagem do público
         - Call-to-actions persuasivos
      
      5. VARIAÇÕES PARA TESTE:
         - Versão A (principal)
         - Versão B (alternativa)
         - Versão C (diferente abordagem)
         - Critérios de teste
      
      Inclua também sugestões de melhorias e adaptações para diferentes canais.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'copywriting-general', 400, 0.008)

      return NextResponse.json({
        copy: content,
        metadata: {
          type: validatedData.type,
          tone: validatedData.tone,
          framework: validatedData.framework,
          targetAudience: validatedData.targetAudience,
        },
        usage: {
          tokens: 400,
          cost: 0.008
        }
      })
    }

    if (action === 'generate-headlines') {
      const validatedData = headlineGeneratorSchema.parse(data)
      
      const headlineTypes = {
        curiosity: 'Despertar curiosidade e interesse',
        benefit: 'Focar no principal benefício',
        question: 'Fazer pergunta relevante',
        how_to: 'Ensinar algo valioso',
        number: 'Usar números e listas',
        urgency: 'Criar senso de urgência',
        social_proof: 'Usar prova social'
      }

      const prompt = `Gere headlines poderosos do tipo ${validatedData.type}:
      
      Produto/Serviço: ${validatedData.product}
      Principal benefício: ${validatedData.mainBenefit}
      Público-alvo: ${validatedData.targetAudience}
      Plataforma: ${validatedData.platform}
      Abordagem: ${headlineTypes[validatedData.type]}
      ${validatedData.keywords ? `Palavras-chave: ${validatedData.keywords.join(', ')}` : ''}
      
      Crie 15 headlines variados seguindo a abordagem ${validatedData.type.toUpperCase()}:
      
      ESPECIFICAÇÕES POR TIPO:
      ${validatedData.type === 'curiosity' ? '- Criar lacuna de curiosidade\n- Usar palavras como "segredo", "revelado", "descoberta"\n- Prometer informação valiosa' : ''}
      ${validatedData.type === 'benefit' ? '- Destacar o principal benefício\n- Ser específico e mensurável\n- Focar no resultado final' : ''}
      ${validatedData.type === 'question' ? '- Fazer pergunta que ressoa com a dor\n- Usar "Você", "Como", "Por que"\n- Despertar autorreflexão' : ''}
      ${validatedData.type === 'how_to' ? '- Prometer ensinar algo\n- Ser específico no resultado\n- Usar "Como", "Maneira", "Método"' : ''}
      ${validatedData.type === 'number' ? '- Usar números ímpares\n- Listas e steps\n- Dados específicos' : ''}
      ${validatedData.type === 'urgency' ? '- Criar escassez de tempo\n- Usar "Agora", "Último", "Apenas"\n- Consequências de não agir' : ''}
      ${validatedData.type === 'social_proof' ? '- Usar estatísticas\n- Depoimentos integrados\n- Números de usuários' : ''}
      
      Para cada headline, inclua:
      1. O headline principal
      2. Variação mais curta
      3. Variação mais longa
      4. Score de impacto (1-10)
      5. Melhor uso recomendado
      
      CRITÉRIOS DE QUALIDADE:
      - Claro e específico
      - Relevante para o público
      - Desperta emoção
      - Promete benefício
      - Fácil de entender
      - Adequado à plataforma
      
      Organize por ordem de impacto potencial e inclua dicas de quando usar cada um.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'headline-generator', 300, 0.006)

      return NextResponse.json({
        headlines: content,
        metadata: {
          type: validatedData.type,
          platform: validatedData.platform,
          mainBenefit: validatedData.mainBenefit,
        },
        usage: {
          tokens: 300,
          cost: 0.006
        }
      })
    }

    if (action === 'generate-email-copy') {
      const validatedData = emailCopySchema.parse(data)
      
      const emailSpecs = {
        welcome: 'Boas-vindas calorosas, expectativas, primeiro valor',
        sales: 'Persuasão direta, benefícios, urgência, CTA forte',
        nurture: 'Valor educativo, construir relacionamento, soft sell',
        cart_abandonment: 'Lembrar do carrinho, superar objeções, incentivo',
        reactivation: 'Reconquistar atenção, nova proposta, benefícios',
        newsletter: 'Informativo, valor consistente, engajamento'
      }

      const prompt = `Crie um e-mail ${validatedData.emailType} otimizado:
      
      Tipo: ${validatedData.emailType} (${emailSpecs[validatedData.emailType]})
      Produto/Serviço: ${validatedData.product}
      Público-alvo: ${validatedData.targetAudience}
      Tom: ${validatedData.tone}
      Objetivo: ${validatedData.objective}
      ${validatedData.personalizedData ? `Dados para personalização: ${JSON.stringify(validatedData.personalizedData)}` : ''}
      
      Crie um e-mail completo e persuasivo:
      
      1. SUBJECT LINES (5 variações):
         - Principal (direta)
         - Curiosidade
         - Benefício
         - Urgência
         - Pergunta
      
      2. PREVIEW TEXT:
         - Complementa o subject
         - 90-100 caracteres
         - Reforça o interesse
      
      3. ESTRUTURA DO E-MAIL:
         
         ABERTURA:
         - Saudação personalizada
         - Hook interessante
         - Contexto relevante
         
         DESENVOLVIMENTO:
         ${validatedData.emailType === 'welcome' ? '- Agradecer pela inscrição\n- Explicar o que esperar\n- Primeiro valor imediato' : ''}
         ${validatedData.emailType === 'sales' ? '- Apresentar problema/oportunidade\n- Mostrar solução\n- Benefícios específicos\n- Prova social' : ''}
         ${validatedData.emailType === 'nurture' ? '- Conteúdo educativo\n- Dicas práticas\n- Construir autoridade\n- Soft mention do produto' : ''}
         ${validatedData.emailType === 'cart_abandonment' ? '- Lembrar dos itens\n- Superar objeções comuns\n- Oferecer incentivo\n- Facilitar compra' : ''}
         ${validatedData.emailType === 'reactivation' ? '- Reconhecer ausência\n- Nova proposta de valor\n- Benefícios perdidos\n- Incentivo especial' : ''}
         ${validatedData.emailType === 'newsletter' ? '- Conteúdo valioso\n- Novidades relevantes\n- Dicas úteis\n- Próximos passos' : ''}
         
         FECHAMENTO:
         - Resumo do valor
         - Call-to-action claro
         - Próximos passos
         - Despedida calorosa
      
      4. ELEMENTOS DE PERSONALIZAÇÃO:
         - Uso do nome
         - Referências específicas
         - Histórico quando aplicável
         - Segmentação comportamental
      
      5. OTIMIZAÇÕES:
         - Mobile-friendly
         - Scannable (bullets, short paragraphs)
         - Links rastreáveis
         - Imagens otimizadas
         - Botões de CTA destacados
      
      6. TESTES SUGERIDOS:
         - Subject lines
         - CTAs
         - Horários de envio
         - Personalização vs genérico
      
      Inclua métricas esperadas (open rate, click rate, conversion rate) e dicas de otimização.`

      const content = await generateText(prompt, 'funnel')
      await trackAIUsage(context.agencyId, 'email-copywriting', 350, 0.007)

      return NextResponse.json({
        emailCopy: content,
        metadata: {
          emailType: validatedData.emailType,
          tone: validatedData.tone,
          objective: validatedData.objective,
        },
        usage: {
          tokens: 350,
          cost: 0.007
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "generate-copy", "generate-headlines" ou "generate-email-copy"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no gerador de copywriting:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}