import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      oldTitle,
      oldDescription,
      oldTags,
      videoTopic,
      performance,
      channelNiche 
    } = await request.json()

    const prompt = `Você é um especialista em recuperação e otimização de vídeos antigos no YouTube.
    
Com base nas seguintes informações do vídeo existente:
- Título atual: ${oldTitle}
- Descrição atual: ${oldDescription || 'Não fornecida'}
- Tags atuais: ${oldTags || 'Não fornecidas'}
- Tópico do vídeo: ${videoTopic || 'Não especificado'}
- Performance atual: ${performance || 'Baixa'} (views/engajamento)
- Nicho do canal: ${channelNiche || 'Geral'}

Crie uma estratégia completa de otimização:

1. **NOVOS TÍTULOS**:
   - Título principal otimizado (máx 60 caracteres)
   - 4 variações para teste A/B
   - Análise do título antigo (o que melhorar)
   - Gatilhos mentais recomendados

2. **DESCRIÇÃO RENOVADA**:
   - Nova descrição completa e otimizada
   - Primeiras 125 caracteres (mais importantes)
   - Estrutura com timestamps
   - CTAs atualizados
   - Links internos para vídeos relacionados
   - Hashtags atualizadas (#15-20)

3. **TAGS OTIMIZADAS**:
   - 20-25 tags novas e relevantes
   - Remoção de tags obsoletas
   - Tags de tendência atual
   - Tags de cauda longa
   - Ordem de prioridade

4. **THUMBNAIL ATUALIZADA**:
   - Conceito visual moderno
   - Texto sugerido
   - Cores e elementos visuais
   - Psicologia das cores aplicada

5. **ESTRATÉGIA DE RELANÇAMENTO**:
   - Melhor momento para atualizar
   - Como promover o vídeo atualizado
   - Stories/Shorts para impulsionar
   - Community post sugerido

6. **LINKS E CONEXÕES**:
   - Vídeos para adicionar nas telas finais
   - Cards interativos sugeridos
   - Playlist ideal
   - Vídeos relacionados para descrição

7. **ANÁLISE COMPETITIVA**:
   - O que a concorrência está fazendo
   - Gaps a explorar
   - Diferenciação possível

8. **MÉTRICAS DE SUCESSO**:
   - KPIs para monitorar após otimização
   - Prazo para avaliar resultados
   - Sinais de que está funcionando

Formate tudo de forma prática para implementação imediata.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em recuperação de vídeos antigos do YouTube, especializado em dar nova vida a conteúdos com baixo desempenho."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    })

    const optimizationData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      optimization: optimizationData,
      message: 'Otimização gerada com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar otimização:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar otimização' },
      { status: 500 }
    )
  }
}
