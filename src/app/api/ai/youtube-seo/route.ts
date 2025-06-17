import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      scriptOrTheme,
      videoType,
      targetAudience,
      keywords,
      channelNiche 
    } = await request.json()

    const prompt = `Você é um especialista em SEO para YouTube com vasta experiência em otimização de vídeos.
    
Com base nas seguintes informações:
- Roteiro/Tema: ${scriptOrTheme}
- Tipo de vídeo: ${videoType || 'Geral'}
- Público-alvo: ${targetAudience || 'Geral'}
- Palavras-chave principais: ${keywords || 'N/A'}
- Nicho do canal: ${channelNiche || 'N/A'}

Gere conteúdo otimizado para SEO:

1. **TÍTULOS OTIMIZADOS**:
   - Título principal (máx 60 caracteres, alta CTR)
   - 5 variações alternativas
   - Use gatilhos mentais e palavras-chave

2. **DESCRIÇÃO COMPLETA**:
   - Parágrafo inicial (primeiras 125 caracteres visíveis)
   - Sumário com timestamps (se aplicável)
   - Descrição detalhada do conteúdo
   - Links importantes
   - CTAs estratégicos
   - Hashtags relevantes (10-15)
   - Informações sobre o canal

3. **TAGS SUGERIDAS**:
   - 15-20 tags principais
   - Mix de tags amplas e específicas
   - Tags de cauda longa
   - Tags de tendência
   - Ordem de prioridade

4. **ESTRATÉGIAS DE SEO**:
   - Palavras-chave para repetir
   - Termos relacionados
   - Perguntas frequentes para incluir
   - Momentos ideais para cards e telas finais

5. **THUMBNAIL**:
   - Texto sugerido para thumbnail
   - Cores recomendadas
   - Elementos visuais importantes

6. **OTIMIZAÇÃO EXTRA**:
   - Melhor horário para publicar
   - Playlists recomendadas
   - Vídeos para linkar

Formate tudo pronto para copiar e colar no YouTube.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em SEO para YouTube, especializado em aumentar visualizações e engajamento através de otimização."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })

    const seoData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      seoContent: seoData,
      message: 'Conteúdo SEO gerado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar SEO:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar conteúdo SEO' },
      { status: 500 }
    )
  }
}
