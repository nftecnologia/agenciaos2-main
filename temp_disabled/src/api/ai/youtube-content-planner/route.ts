import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      postingFrequency,
      targetAudience,
      mainThemes,
      channelGoals,
      duration 
    } = await request.json()

    const prompt = `Você é um estrategista de conteúdo para YouTube com expertise em crescimento de canais.
    
Com base nas seguintes informações:
- Frequência de postagens: ${postingFrequency} (ex: 2x por semana)
- Público-alvo: ${targetAudience}
- Temas principais: ${mainThemes}
- Objetivos do canal: ${channelGoals || 'Crescimento e engajamento'}
- Período do calendário: ${duration || '30'} dias

Crie um planejamento de conteúdo completo:

1. **CALENDÁRIO EDITORIAL**:
   - Cronograma detalhado dia a dia
   - Tema de cada vídeo
   - Formato (longo, short, live)
   - Objetivo específico de cada conteúdo

2. **ESTRUTURA DOS VÍDEOS**:
   Para cada vídeo planejado:
   - Título sugerido
   - Briefing resumido (3-5 linhas)
   - Duração estimada
   - Tipo de conteúdo
   - Gancho principal

3. **ESTRATÉGIA DE CONTEÚDO**:
   - Pilares de conteúdo (3-5)
   - Proporção ideal entre tipos
   - Séries ou playlists sugeridas
   - Temas de alta performance

4. **SHORTS STRATEGY**:
   - Quantos shorts por semana
   - Temas específicos para shorts
   - Estratégia de reaproveitamento

5. **ENGAJAMENTO**:
   - Lives programadas
   - Vídeos de comunidade
   - Colaborações sugeridas
   - Enquetes e interações

6. **MÉTRICAS E METAS**:
   - KPIs para acompanhar
   - Metas por período
   - Checkpoints de análise

7. **PRODUÇÃO**:
   - Dias de gravação sugeridos
   - Batch recording (gravação em lote)
   - Pipeline de edição
   - Buffer de conteúdo

8. **TENDÊNCIAS**:
   - Temas em alta no nicho
   - Datas comemorativas relevantes
   - Oportunidades sazonais

Formate como um calendário prático e executável.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de conteúdo expert em YouTube, especializado em criar calendários editoriais que geram crescimento consistente."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const plannerData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      contentPlan: plannerData,
      message: 'Calendário editorial gerado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar planejamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar planejamento de conteúdo' },
      { status: 500 }
    )
  }
}
