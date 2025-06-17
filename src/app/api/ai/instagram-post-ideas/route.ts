import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      niche,
      targetAudience,
      specialDates,
      themes,
      objectives 
    } = await request.json()

    const prompt = `Você é um estrategista de conteúdo especialista em Instagram com vasta experiência em criar ideias virais.
    
Com base nas seguintes informações:
- Nicho: ${niche}
- Público-alvo: ${targetAudience}
- Datas especiais: ${specialDates || 'Nenhuma específica'}
- Temas de interesse: ${themes || 'Variados'}
- Objetivos: ${objectives || 'Engajamento e crescimento'}

Gere ideias criativas de posts para Instagram:

1. **IDEIAS PARA FEED** (10 sugestões):
   - Título da ideia
   - Formato visual sugerido
   - Estrutura do texto
   - Objetivo do post
   - Elementos visuais necessários

2. **IDEIAS PARA STORIES** (10 sugestões):
   - Conceito rápido
   - Elementos interativos (enquete, pergunta, quiz)
   - Sequência sugerida
   - CTA específico

3. **IDEIAS PARA REELS** (10 sugestões):
   - Conceito do vídeo
   - Trilha sonora/tendência sugerida
   - Roteiro básico
   - Duração ideal
   - Gancho inicial

4. **IDEIAS PARA CARROSSÉIS** (5 sugestões):
   - Tema central
   - Número de slides
   - Estrutura de cada slide
   - Visual sugerido
   - CTA final

5. **ABORDAGENS DIFERENTES**:
   Para cada tema principal, sugira 4 abordagens:
   - Lista (ex: "5 dicas para...")
   - Dica rápida
   - Polêmica/Opinião
   - Storytelling/Caso real

6. **CALENDÁRIO SUGERIDO**:
   - Melhor horário para cada tipo
   - Frequência ideal
   - Mix de conteúdo semanal

7. **ELEMENTOS DE VIRALIZAÇÃO**:
   - Ganchos poderosos
   - Tendências atuais
   - Formatos em alta

Formate de forma organizada e prática para implementação.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de conteúdo expert em Instagram, especializado em criar ideias que geram alto engajamento e viralização."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 3000,
    })

    const ideasData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      ideas: ideasData,
      message: 'Ideias geradas com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar ideias:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar ideias de posts' },
      { status: 500 }
    )
  }
}
