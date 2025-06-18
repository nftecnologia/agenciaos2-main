import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      theme,
      objective,
      targetAudience,
      toneOfVoice,
      briefing,
      postType 
    } = await request.json()

    const prompt = `Você é um copywriter especialista em Instagram com anos de experiência criando legendas que geram engajamento.
    
Com base nas seguintes informações:
- Tema do post: ${theme}
- Objetivo: ${objective} (venda/engajamento/educativo/institucional)
- Público-alvo: ${targetAudience}
- Tom de voz: ${toneOfVoice || 'Profissional e amigável'}
- Tipo de post: ${postType || 'Feed'}
- Briefing adicional: ${briefing || 'N/A'}

Crie legendas otimizadas para Instagram:

1. **LEGENDA PRINCIPAL**:
   - Gancho inicial (primeiras 2 linhas que aparecem)
   - Desenvolvimento do conteúdo
   - CTA claro e persuasivo
   - Emojis estratégicos

2. **VARIAÇÕES DE CTA** (3 opções):
   - CTA de engajamento
   - CTA de conversão
   - CTA de compartilhamento

3. **PERGUNTAS PARA COMENTÁRIOS** (5 sugestões):
   - Perguntas que estimulem respostas
   - Enquetes informais
   - Pedidos de opinião

4. **ESTRUTURA PARA DIFERENTES FORMATOS**:
   - Versão para Feed (até 2200 caracteres)
   - Versão para Stories (mais direta)
   - Versão para Reels (mais dinâmica)

5. **ELEMENTOS DE ENGAJAMENTO**:
   - Uso de storytelling quando aplicável
   - Gatilhos mentais adequados
   - Quebras de linha estratégicas

6. **HASHTAGS SUGERIDAS**:
   - 10 hashtags relevantes
   - Mix de alcance (populares e nicho)

Formate de forma clara e pronta para copiar.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em copywriting para Instagram, especializado em criar legendas que geram alto engajamento e conversão."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const captionData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      caption: captionData,
      message: 'Legenda gerada com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar legenda:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar legenda' },
      { status: 500 }
    )
  }
}
