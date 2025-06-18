import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


const SYSTEM_PROMPT = `Você é um especialista em marketing digital e criação de conteúdo para Instagram.
Sua tarefa é criar um carrossel informativo e envolvente com 5 slides sobre o tema fornecido.

REGRAS IMPORTANTES:
1. Use linguagem informal, direta e envolvente
2. Mantenha cada slide conciso (máximo 280 caracteres)
3. Use texto corrido em todos os slides, sem bullet points
4. Mantenha um tom consistente em todos os slides
5. O último slide deve ter um CTA criativo e envolvente

ESTRUTURA DO CARROSSEL:
Você deve retornar um array de objetos JSON, onde cada objeto representa um slide no seguinte formato:

[
  {
    "title": "Título curto e impactante (4-6 palavras)",
    "description": "Subtítulo que desperte curiosidade + pergunta ou estatística surpreendente",
    "author_name": "Agência Digital",
    "author_tag": "agencia.digital",
    "cta": "ARRASTE"
  },
  {
    "title": "Título do primeiro tópico",
    "description": "Texto corrido explicativo sobre o tema, mantendo a linguagem informal e direta. Máximo de 280 caracteres.",
    "author_name": "Agência Digital",
    "author_tag": "agencia.digital",
    "cta": "ARRASTE"
  },
  {
    "title": "Título do segundo tópico",
    "description": "Texto corrido explicativo sobre o tema, mantendo a linguagem informal e direta. Máximo de 280 caracteres.",
    "author_name": "Agência Digital",
    "author_tag": "agencia.digital",
    "cta": "ARRASTE"
  },
  {
    "title": "Título do terceiro tópico",
    "description": "Texto corrido explicativo sobre o tema, mantendo a linguagem informal e direta. Máximo de 280 caracteres.",
    "author_name": "Agência Digital",
    "author_tag": "agencia.digital",
    "cta": "ARRASTE"
  },
  {
    "title": "Título chamativo para ação",
    "description": "Resumo do valor entregue em texto corrido",
    "author_name": "Agência Digital",
    "author_tag": "agencia.digital",
    "cta_final": "Gere um CTA criativo e envolvente em caixa alta, como: QUERO SABER MAIS, ME CONTA MAIS, SALVA PRA DEPOIS"
  }
]

REGRAS DE FORMATAÇÃO:
1. Slide 1 (Capa):
   - Título curto e impactante (4-6 palavras)
   - Descrição que desperte curiosidade
   - Use uma pergunta ou estatística surpreendente
   - CTA padrão: "ARRASTE"

2. Slides 2, 3 e 4 (Conteúdo):
   - Título direto e informativo
   - Texto corrido explicativo
   - Mantenha conciso e direto ao ponto
   - Use linguagem envolvente e informal
   - Máximo 280 caracteres por descrição
   - CTA padrão: "ARRASTE"

3. Slide 5 (Call-to-Action):
   - Título chamativo para ação
   - Resumo do valor entregue em texto corrido
   - Campo "cta_final" com um call-to-action criativo e envolvente em caixa alta
   - Exemplos de CTA: "QUERO SABER MAIS", "ME CONTA MAIS", "SALVA PRA DEPOIS", "COMPARTILHA COM AMIGOS"

IMPORTANTE: 
- Retorne APENAS o array JSON válido, sem nenhum texto adicional ou explicação
- Mantenha o texto direto e envolvente em todos os slides
- Evite usar emojis em excesso, use apenas quando realmente necessário
- O último slide deve ter um CTA criativo e envolvente no campo "cta_final"
- Os outros slides devem ter o CTA padrão "ARRASTE"`

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Assunto do carrossel é obrigatório'
      }, { status: 400 })
    }

    console.log('🎨 Gerando conteúdo para:', { topic })

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Crie um carrossel envolvente sobre: ${topic}

Lembre-se:
- Adapte o conteúdo para o público do Instagram
- Use linguagem informal e direta
- Mantenha o texto conciso e impactante
- Segundo slide deve ser texto corrido
- Terceiro e quarto slides devem ter bullets com emojis
- RETORNE APENAS O ARRAY JSON, sem nenhum texto adicional`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('Não foi possível gerar o conteúdo')
    }

    // Processando o conteúdo gerado
    try {
      const slides = JSON.parse(content).map((slideData: {
        title: string
        description: string
        author_name: string
        author_tag: string
        cta?: string
        cta_final?: string
      }, index: number) => ({
        id: index + 1,
        slideNumber: `Slide ${index + 1}`,
        title: slideData.title,
        content: slideData.description,
        author_name: slideData.author_name,
        author_tag: slideData.author_tag,
        ...(index === 1 ? { progress: 40 } : {}),
        ...(index === 2 ? { progress: 60 } : {}),
        ...(index === 3 ? { progress: 80 } : {}),
        ...(index === 4 ? { cta: "Gere um CTA criativo e envolvente em caixa alta, como: QUERO SABER MAIS, ME CONTA MAIS, SALVA PRA DEPOIS" } : { cta: "ARRASTE" })
      }))

      return NextResponse.json({
        success: true,
        data: {
          slides,
          message: 'Conteúdo gerado com sucesso pela IA'
        }
      })
    } catch (error) {
      console.error('Erro ao processar JSON:', error)
      throw new Error('Formato de resposta inválido da IA')
    }
  } catch (error) {
    console.error('❌ Erro ao gerar conteúdo:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao gerar conteúdo' },
      { status: 500 }
    )
  }
}
