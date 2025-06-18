import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      theme,
      targetAudience,
      postType,
      niche,
      objectives 
    } = await request.json()

    const prompt = `Você é um especialista em estratégias de hashtags para Instagram com anos de experiência em alcance orgânico.
    
Com base nas seguintes informações:
- Tema do post: ${theme}
- Público-alvo: ${targetAudience}
- Tipo de post: ${postType || 'Feed'}
- Nicho: ${niche || 'Geral'}
- Objetivos: ${objectives || 'Aumentar alcance e engajamento'}

Crie uma estratégia completa de hashtags:

1. **HASHTAGS PRINCIPAIS** (30 hashtags):
   
   ALTA COMPETIÇÃO (1M+ posts) - 5 hashtags:
   - Hashtags populares do nicho
   - Volume de busca estimado
   
   MÉDIA COMPETIÇÃO (100k-1M posts) - 10 hashtags:
   - Hashtags específicas do segmento
   - Equilíbrio entre alcance e competição
   
   BAIXA COMPETIÇÃO (10k-100k posts) - 10 hashtags:
   - Hashtags de nicho
   - Maior chance de destaque
   
   MICRO NICHO (<10k posts) - 5 hashtags:
   - Hashtags ultra específicas
   - Comunidades engajadas

2. **HASHTAGS POR OBJETIVO**:
   - Para alcance máximo
   - Para engajamento
   - Para conversão
   - Para comunidade

3. **VARIAÇÕES PARA ROTAÇÃO**:
   - Set A (30 hashtags)
   - Set B (30 hashtags)
   - Set C (30 hashtags)
   
4. **HASHTAGS PROIBIDAS/SHADOWBAN**:
   - Lista de hashtags a evitar
   - Motivos de restrição
   
5. **ESTRATÉGIA DE USO**:
   - Como alternar os sets
   - Frequência de mudança
   - Posicionamento (legenda vs comentário)
   
6. **HASHTAGS SAZONAIS/TRENDING**:
   - Hashtags do momento
   - Datas especiais relevantes
   - Tendências do nicho

7. **ANÁLISE E MONITORAMENTO**:
   - Métricas a acompanhar
   - Como testar efetividade
   - Ajustes recomendados

Formate de forma clara e pronta para copiar.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em estratégias de hashtags para Instagram, especializado em maximizar alcance orgânico e evitar shadowban."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const hashtagData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      hashtags: hashtagData,
      message: 'Hashtags geradas com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar hashtags:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar hashtags' },
      { status: 500 }
    )
  }
}
