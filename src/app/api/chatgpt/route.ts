import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import OpenAI from 'openai'
import { getModelConfig, isValidModel } from '@/lib/chatgpt-config'

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se a API Key do OpenAI está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key do OpenAI não configurada' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { messages, model = 'gpt-4o' } = body

    // Validar modelo
    if (!isValidModel(model)) {
      return NextResponse.json(
        { error: `Modelo "${model}" não é suportado` },
        { status: 400 }
      )
    }

    // Validar entrada
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 }
      )
    }

    // Validar estrutura das mensagens
    const validMessages = messages.every(msg => 
      msg.role && msg.content && 
      ['user', 'assistant', 'system'].includes(msg.role)
    )

    if (!validMessages) {
      return NextResponse.json(
        { error: 'Formato de mensagens inválido' },
        { status: 400 }
      )
    }

    // Usar configurações otimizadas para compatibilidade com ChatGPT oficial
    const modelConfig = getModelConfig(model)
    
    // Não adicionar system message automático - deixar que o frontend controle
    const finalMessages = messages

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🤖 Usando modelo: ${model}`)
      console.log(`⚙️ Configuração:`, modelConfig)
      console.log(`💬 ${finalMessages.length} mensagens`)
    }

    // Fazer a requisição para o OpenAI com configurações idênticas ao ChatGPT
    const completion = await openai.chat.completions.create({
      model,
      messages: finalMessages,
      ...modelConfig
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json(
        { error: 'Não foi possível gerar uma resposta' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: responseContent,
      model: completion.model,
      usage: completion.usage,
    })

  } catch (error: unknown) {
    console.error('Erro na API do ChatGPT:', error)

    // Tratar erros específicos do OpenAI
    const errorObj = error as { status?: number }
    
    if (errorObj?.status === 401) {
      return NextResponse.json(
        { error: 'API Key do OpenAI inválida' },
        { status: 500 }
      )
    }

    if (errorObj?.status === 429) {
      return NextResponse.json(
        { error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' },
        { status: 429 }
      )
    }

    if (errorObj?.status === 400) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos enviados para o OpenAI' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
