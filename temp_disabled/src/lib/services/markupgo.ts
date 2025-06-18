import { env } from '@/env.mjs'

interface MarkupGoResponse {
  url: string
  path: string
  format: string
  size: number
  width: number
  height: number
}

export interface SlideContext {
  title: string
  description: string
  image_url?: string
  author_name: string
  author_tag: string
  cta?: string
  backgroundUrl?: string
  progress?: number
}

const TEMPLATE_IDS = {
  COVER: "6847a235ecdaf79714f14516",
  CONTENT: "6847af45ecdaf79714f1459c"
}

export async function generateCoverSlide(context: SlideContext): Promise<MarkupGoResponse> {
  try {
    console.log('📝 Gerando slide de capa:', context)
    
    if (!env.MARKUPGO_API_KEY) {
      throw new Error('API Key do MarkupGo não encontrada')
    }

    const payload = {
      source: {
        type: "template",
        data: {
          id: TEMPLATE_IDS.COVER,
          context: {
            title: context.title,
            description: context.description,
            image_url: context.image_url || "https://i.postimg.cc/Xq94tJwJ/image.png",
            author_name: context.author_name,
            author_tag: context.author_tag,
            cta: context.cta || "ARRASTE"
          },
          format: "png",
        }
      },
    }

    console.log('📤 Payload para capa:', JSON.stringify(payload, null, 2))

    const response = await fetch("https://api.markupgo.com/api/v1/image", {
      method: "POST",
      headers: {
        "x-api-key": env.MARKUPGO_API_KEY,
        "content-type": "application/json"
      } as HeadersInit,
      body: JSON.stringify(payload)
    })

    console.log('📥 Status da resposta (capa):', response.status, response.statusText)
    const responseData = await response.json()
    console.log('📥 Dados da resposta (capa):', responseData)

    if (!response.ok) {
      throw new Error(`Falha ao gerar imagem no MarkupGo: ${response.status} ${response.statusText}\nDetalhes: ${JSON.stringify(responseData)}`)
    }

    return responseData
  } catch (error) {
    console.error('❌ Erro ao gerar slide de capa:', error)
    throw error
  }
}

// Função para gerar slides de conteúdo (você pode adicionar mais templates conforme necessário)
export async function generateContentSlide(context: SlideContext): Promise<MarkupGoResponse> {
  try {
    console.log('📝 Gerando slide de conteúdo:', context)

    if (!env.MARKUPGO_API_KEY) {
      throw new Error('API Key do MarkupGo não encontrada')
    }

    const payload = {
      source: {
        type: "template",
        data: {
          id: TEMPLATE_IDS.CONTENT,
          context: {
            title: context.title,
            description: context.description,
            author_name: context.author_name,
            author_tag: context.author_tag,
            cta: context.cta || "ARRASTE",
            progress: context.progress,
            image_url: context.image_url
          },
          format: "png",
        }
      },
    }

    console.log('📤 Payload para conteúdo:', JSON.stringify(payload, null, 2))

    const response = await fetch("https://api.markupgo.com/api/v1/image", {
      method: "POST",
      headers: {
        "x-api-key": env.MARKUPGO_API_KEY,
        "content-type": "application/json"
      } as HeadersInit,
      body: JSON.stringify(payload)
    })

    console.log('📥 Status da resposta (conteúdo):', response.status, response.statusText)
    const responseData = await response.json()
    console.log('📥 Dados da resposta (conteúdo):', responseData)

    if (!response.ok) {
      throw new Error(`Falha ao gerar imagem no MarkupGo: ${response.status} ${response.statusText}\nDetalhes: ${JSON.stringify(responseData)}`)
    }

    return responseData
  } catch (error) {
    console.error('❌ Erro ao gerar slide de conteúdo:', error)
    throw error
  }
} 