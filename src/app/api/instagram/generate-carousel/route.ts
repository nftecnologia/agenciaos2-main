import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateContentSlide, generateCoverSlide } from '@/lib/services/markupgo'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const generateCarouselSchema = z.object({
  slides: z.array(z.object({
    title: z.string(),
    content: z.string(),
    cta: z.string().optional(),
    cta_final: z.string().optional()
  })),
  brandConfig: z.object({
    agencyName: z.string(),
    contactInfo: z.string(),
  })
})

async function generateCoverImageWithDALLE(title: string): Promise<string> {
  try {
    const prompt = `Crie uma imagem fotográfica profissional e impactante para um post do Instagram sobre "${title}".

A imagem deve ter:
- Fotografia de alta qualidade com aspecto cinematográfico
- Cores vibrantes e ricas, com alto contraste
- Iluminação dramática e profissional
- Profundidade de campo artística
- Texturas e detalhes realistas
- Composição que conte uma história visual
- Ambiente e cenário imersivos
- Qualidade de produção premium

Estilo fotográfico:
- Ultra realista e detalhado
- Aparência de fotografia profissional
- Cores vivas e saturadas
- Iluminação natural e suave
- Foco nítido no tema principal
- Bokeh suave no fundo quando apropriado
- Aspecto editorial de revista

Especificações técnicas:
- Formato paisagem 16:9
- Resolução ultra alta
- HDR com ampla gama dinâmica
- Qualidade máxima possível
- Espaço adequado para texto na composição`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      style: "vivid"
    })

    if (!response.data?.[0]?.url) {
      throw new Error('URL da imagem não encontrada na resposta do DALL-E')
    }

    return response.data[0].url
  } catch (error) {
    console.error('Erro ao gerar imagem com DALL-E:', error)
    throw error
  }
}

async function generateFinalSlide(data: {
  title: string,
  description: string,
  author_name: string,
  author_tag: string,
  cta: string
}) {
  try {
    const response = await fetch("https://api.markupgo.com/api/v1/image", {
      method: "POST",
      headers: {
        "x-api-key": process.env.MARKUPGO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        source: {
          type: "template",
          data: {
            id: "684828a5ecdaf79714f14e71",
            context: {
              title: data.title,
              description: data.description,
              author_name: data.author_name,
              author_tag: data.author_tag,
              cta: data.cta
            },
            format: "png",
          }
        },
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao gerar slide final')
    }

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Erro ao gerar slide final:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slides, brandConfig } = generateCarouselSchema.parse(body)

    const generatedImages = []

    // Gerar imagem para a capa
    console.log('🎨 Gerando imagem de capa...')
    const coverImageUrl = await generateCoverImageWithDALLE(slides[0].title)
    
    // Gerar slide de capa com a imagem gerada
    const coverSlide = await generateCoverSlide({
      title: slides[0].title,
      description: slides[0].content,
      author_name: brandConfig.agencyName,
      author_tag: brandConfig.contactInfo,
      cta: slides[0].cta,
      image_url: coverImageUrl
    })
    generatedImages.push(coverSlide)

    // Gerar slides de conteúdo
    for (let i = 1; i <= 3; i++) {
      // Gerar imagem para o slide de conteúdo
      console.log(`🎨 Gerando imagem para slide ${i}...`)
      const contentImageUrl = await generateCoverImageWithDALLE(slides[i].title)

      const contentSlide = await generateContentSlide({
        title: slides[i].title,
        description: slides[i].content,
        author_name: brandConfig.agencyName,
        author_tag: brandConfig.contactInfo,
        cta: slides[i].cta,
        progress: i === 1 ? 40 : i === 2 ? 60 : 80,
        image_url: contentImageUrl
      })
      generatedImages.push(contentSlide)
    }

    // Gerar slide final
    const finalSlide = await generateFinalSlide({
      title: slides[4].title,
      description: slides[4].content,
      author_name: brandConfig.agencyName,
      author_tag: brandConfig.contactInfo,
      cta: slides[4].cta_final || "COMENTE ABAIXO"
    })
    generatedImages.push(finalSlide)

    return NextResponse.json({
      success: true,
      data: {
        images: generatedImages.map(img => ({
          url: img.url
        }))
      }
    })
  } catch (error) {
    console.error('❌ Erro ao gerar carrossel:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao gerar carrossel' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    templates: [
      {
        id: 'business-tips',
        name: 'Dicas de Negócio',
        description: 'Carrossel com dicas e insights para negócios',
        slides: [
          { title: 'Título Principal', subtitle: 'Número de dicas' },
          { title: 'Dica 1', content: 'Conteúdo da primeira dica' },
          { title: 'Dica 2', content: 'Conteúdo da segunda dica' },
          { title: 'Dica 3', content: 'Conteúdo da terceira dica' },
          { title: 'Call to Action', content: 'Mensagem final', ctaText: 'Entre em contato' }
        ]
      },
      {
        id: 'client-results',
        name: 'Resultados do Cliente',
        description: 'Case de sucesso com antes/depois',
        slides: [
          { title: 'Desafio do Cliente', content: 'Descrição do problema' },
          { title: 'Nossa Solução', content: 'Estratégia aplicada' },
          { title: 'Resultados Obtidos', content: 'Números e conquistas' },
          { title: 'Trabalhe Conosco', content: 'Convite para novos clientes', ctaText: 'Solicitar orçamento' }
        ]
      }
    ]
  })
}
