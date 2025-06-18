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
      duration,
      targetAudience,
      additionalInfo 
    } = await request.json()

    const prompt = `Você é um roteirista especialista em YouTube com anos de experiência criando conteúdo viral.
    
Com base nas seguintes informações:
- Tema do vídeo: ${theme}
- Objetivo: ${objective} (educacional/institucional/venda/review/tutorial)
- Duração desejada: ${duration} minutos
- Público-alvo: ${targetAudience || 'Geral'}
- Informações adicionais: ${additionalInfo || 'N/A'}

Crie um roteiro completo e profissional incluindo:

1. **TÍTULO PRINCIPAL**
   - Um título chamativo e otimizado para SEO
   - 3 variações alternativas

2. **ESTRUTURA DO ROTEIRO**:
   a) **INTRODUÇÃO (15-30 segundos)**:
      - Hook inicial (primeiros 3 segundos)
      - Apresentação do que será abordado
      - Por que assistir até o final

   b) **DESENVOLVIMENTO**:
      - Tópicos principais organizados
      - Argumentos e exemplos para cada tópico
      - Transições entre tópicos
      - Momentos para adicionar B-roll ou gráficos

   c) **ENGAJAMENTO**:
      - Perguntas para a audiência
      - Momentos para pedir like/inscrição
      - Pontos de interação

   d) **ENCERRAMENTO**:
      - Resumo dos pontos principais
      - CTA final
      - Teaser do próximo vídeo

3. **SUGESTÕES DE CORTES PARA SHORTS**:
   - 3 trechos de 30-60 segundos
   - Momentos de maior impacto
   - Ganchos para cada short

4. **ELEMENTOS VISUAIS**:
   - Sugestões de thumbnails
   - Momentos para inserir textos na tela
   - Indicações de cortes e transições

5. **DICAS DE PRODUÇÃO**:
   - Tom de voz recomendado
   - Ritmo e pausas
   - Expressões e gestos importantes

Formate o roteiro de forma clara e prática para gravação.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um roteirista expert em YouTube, especializado em criar conteúdo que prende a atenção e gera engajamento."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    })

    const scriptData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      script: scriptData,
      message: 'Roteiro gerado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar roteiro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar roteiro' },
      { status: 500 }
    )
  }
}
