import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key não configurada' }, { status: 500 })
    }

    const body = await req.json()
    const { title, targetAudience, industry } = body

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    const prompt = `
Crie uma descrição detalhada e estruturada para um ebook sobre "${title}".

Contexto adicional:
- Público-alvo: ${targetAudience || 'Profissionais e empreendedores'}
- Setor: ${industry || 'Geral'}

A resposta deve ser um JSON com a seguinte estrutura:
{
  "description": "Descrição geral do ebook (2-3 parágrafos)",
  "targetAudience": "Descrição específica do público-alvo",
  "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
  "benefits": ["Benefício 1", "Benefício 2", "Benefício 3"],
  "chapters": [
    {
      "number": 1,
      "title": "Título do Capítulo",
      "description": "Breve descrição do que será abordado",
      "pages": 5
    }
  ],
  "totalPages": 50,
  "estimatedReadTime": "2-3 horas",
  "difficulty": "Iniciante/Intermediário/Avançado"
}

Crie exatamente 10 capítulos, cada um com 5 páginas, totalizando 50 páginas.
O conteúdo deve ser profissional, prático e actionável.
Responda APENAS com o JSON, sem texto adicional.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'Erro ao gerar descrição' }, { status: 500 })
    }

    const ebookDescription = JSON.parse(content)

    return NextResponse.json({
      success: true,
      data: ebookDescription,
      usage: completion.usage
    })

  } catch (error) {
    console.error('Erro ao gerar descrição do ebook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}