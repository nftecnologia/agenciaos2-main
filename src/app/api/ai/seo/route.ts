import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { generateText, trackAIUsage } from '@/lib/openai'
import { applyRateLimit } from '@/lib/rate-limit'

const seoAnalysisSchema = z.object({
  url: z.string().url('URL inválida'),
  targetKeywords: z.array(z.string()).min(1, 'Pelo menos uma palavra-chave é obrigatória'),
  competitors: z.array(z.string().url()).optional(),
  location: z.string().optional(),
})

const keywordResearchSchema = z.object({
  seedKeywords: z.array(z.string()).min(1, 'Pelo menos uma palavra-chave semente é obrigatória'),
  industry: z.string().min(1, 'Setor é obrigatório'),
  location: z.string().optional(),
  language: z.enum(['pt', 'en', 'es']).default('pt'),
  intent: z.enum(['informational', 'commercial', 'transactional', 'navigational', 'all']).default('all'),
})

const contentOptimizationSchema = z.object({
  content: z.string().min(100, 'Conteúdo deve ter pelo menos 100 caracteres'),
  targetKeyword: z.string().min(1, 'Palavra-chave principal é obrigatória'),
  secondaryKeywords: z.array(z.string()).optional(),
  contentType: z.enum(['blog', 'product', 'service', 'landing']).default('blog'),
})

const technicalSeoSchema = z.object({
  url: z.string().url('URL inválida'),
  checkType: z.enum(['full', 'performance', 'mobile', 'security', 'structure']).default('full'),
})

// POST /api/ai/seo - Ferramentas de SEO com IA
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'ai')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'analyze-page') {
      const validatedData = seoAnalysisSchema.parse(data)
      
      const prompt = `Faça uma análise SEO completa para:
      
      URL: ${validatedData.url}
      Palavras-chave alvo: ${validatedData.targetKeywords.join(', ')}
      ${validatedData.competitors ? `Concorrentes: ${validatedData.competitors.join(', ')}` : ''}
      ${validatedData.location ? `Localização: ${validatedData.location}` : ''}
      
      Analise e forneça recomendações para:
      
      1. SEO On-Page:
         - Title tag otimização
         - Meta description
         - Headers (H1, H2, H3)
         - Densidade de palavras-chave
         - URLs amigáveis
         - Alt text das imagens
         - Schema markup
      
      2. Conteúdo:
         - Qualidade e relevância
         - Estrutura e legibilidade
         - Palavras-chave relacionadas
         - Intenção de busca
      
      3. Aspectos Técnicos:
         - Velocidade de carregamento
         - Mobile-friendly
         - HTTPS
         - Sitemap XML
         - Robots.txt
      
      4. Recomendações Prioritárias:
         - Ações imediatas
         - Melhorias de médio prazo
         - Estratégias de longo prazo
      
      5. Score SEO estimado e oportunidades de melhoria`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'seo-analysis', 400, 0.008)

      return NextResponse.json({
        analysis: content,
        metadata: {
          url: validatedData.url,
          targetKeywords: validatedData.targetKeywords,
          analyzedAt: new Date().toISOString(),
        },
        usage: {
          tokens: 400,
          cost: 0.008
        }
      })
    }

    if (action === 'keyword-research') {
      const validatedData = keywordResearchSchema.parse(data)
      
      const prompt = `Faça uma pesquisa de palavras-chave baseada em:
      
      Palavras-chave semente: ${validatedData.seedKeywords.join(', ')}
      Setor: ${validatedData.industry}
      ${validatedData.location ? `Localização: ${validatedData.location}` : ''}
      Idioma: ${validatedData.language}
      Intenção: ${validatedData.intent}
      
      Gere uma lista abrangente de palavras-chave organizadas por:
      
      1. Palavras-chave principais (head terms):
         - Alto volume, alta competição
         - Palavras-chave genéricas do setor
      
      2. Palavras-chave de cauda média:
         - Volume médio, competição moderada
         - Mais específicas
      
      3. Palavras-chave de cauda longa:
         - Baixo volume, baixa competição
         - Altamente específicas
      
      4. Palavras-chave locais (se aplicável):
         - Variações geográficas
         - "Perto de mim"
      
      5. Palavras-chave de intenção comercial:
         - Termos de compra
         - Comparações
         - Reviews
      
      Para cada palavra-chave, inclua:
      - Volume de busca estimado
      - Dificuldade de rankeamento
      - Intenção de busca
      - Oportunidades de conteúdo
      
      Organize por prioridade de implementação.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'keyword-research', 350, 0.007)

      return NextResponse.json({
        keywords: content,
        metadata: {
          seedKeywords: validatedData.seedKeywords,
          industry: validatedData.industry,
          intent: validatedData.intent,
        },
        usage: {
          tokens: 350,
          cost: 0.007
        }
      })
    }

    if (action === 'optimize-content') {
      const validatedData = contentOptimizationSchema.parse(data)
      
      const prompt = `Otimize este conteúdo para SEO:
      
      Palavra-chave principal: ${validatedData.targetKeyword}
      ${validatedData.secondaryKeywords ? `Palavras-chave secundárias: ${validatedData.secondaryKeywords.join(', ')}` : ''}
      Tipo de conteúdo: ${validatedData.contentType}
      
      CONTEÚDO ORIGINAL:
      ${validatedData.content}
      
      Forneça:
      
      1. Versão otimizada do conteúdo com:
         - Melhor uso das palavras-chave
         - Estrutura aprimorada
         - Headers otimizados
         - Densidade de palavra-chave adequada
         - Melhor legibilidade
      
      2. Sugestões de meta tags:
         - Title tag (50-60 caracteres)
         - Meta description (150-160 caracteres)
         - Meta keywords
      
      3. Estrutura de headers:
         - H1 principal
         - Estrutura de H2 e H3
      
      4. Palavras-chave relacionadas para incluir
      
      5. Sugestões de links internos e externos
      
      6. Schema markup recomendado
      
      7. Checklist de otimização aplicada`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'content-optimization', 500, 0.010)

      return NextResponse.json({
        optimizedContent: content,
        metadata: {
          targetKeyword: validatedData.targetKeyword,
          contentType: validatedData.contentType,
          originalLength: validatedData.content.length,
        },
        usage: {
          tokens: 500,
          cost: 0.010
        }
      })
    }

    if (action === 'technical-audit') {
      const validatedData = technicalSeoSchema.parse(data)
      
      const prompt = `Faça uma auditoria técnica de SEO para:
      
      URL: ${validatedData.url}
      Tipo de verificação: ${validatedData.checkType}
      
      Analise e forneça recomendações detalhadas para:
      
      1. Performance:
         - Core Web Vitals
         - Tempo de carregamento
         - Otimização de imagens
         - Compressão de arquivos
         - CDN e cache
      
      2. Mobile:
         - Responsividade
         - Velocidade mobile
         - Usabilidade mobile
         - AMP (se aplicável)
      
      3. Segurança:
         - HTTPS
         - Certificados SSL
         - Redirecionamentos seguros
         - Headers de segurança
      
      4. Estrutura:
         - Arquitetura do site
         - Navegação
         - Breadcrumbs
         - Paginação
         - URLs amigáveis
      
      5. Indexação:
         - Sitemap XML
         - Robots.txt
         - Tags noindex/nofollow
         - Canonical tags
         - Erros 404
      
      6. Dados estruturados:
         - Schema markup
         - Rich snippets
         - Knowledge Graph
      
      Priorize as correções por impacto e urgência.
      Inclua ferramentas recomendadas para implementação.`

      const content = await generateText(prompt, 'seo')
      await trackAIUsage(context.agencyId, 'technical-seo', 450, 0.009)

      return NextResponse.json({
        audit: content,
        metadata: {
          url: validatedData.url,
          checkType: validatedData.checkType,
          auditDate: new Date().toISOString(),
        },
        usage: {
          tokens: 450,
          cost: 0.009
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida. Use "analyze-page", "keyword-research", "optimize-content" ou "technical-audit"' },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro nas ferramentas de SEO:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}