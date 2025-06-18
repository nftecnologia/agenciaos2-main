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
      numberOfSlides,
      visualStyle 
    } = await request.json()

    const prompt = `Você é um especialista em criar carrosséis textuais virais para Instagram.
    
Com base nas seguintes informações:
- Tema central: ${theme}
- Objetivo do carrossel: ${objective}
- Público-alvo: ${targetAudience || 'Geral'}
- Número de slides desejado: ${numberOfSlides || '6-8'}
- Estilo visual: ${visualStyle || 'Minimalista e profissional'}

Crie um carrossel textual estruturado:

1. **ESTRUTURA COMPLETA DO CARROSSEL**:
   
   SLIDE 1 - CAPA:
   - Título impactante (máx 30 caracteres)
   - Subtítulo explicativo
   - Promessa/Benefício
   - Visual: Destaque para o título

   SLIDES 2-[N] - CONTEÚDO:
   - Título do slide (máx 20 caracteres)
   - Texto principal (máx 150 caracteres)
   - Elemento visual sugerido
   - Transição para próximo slide

   SLIDE FINAL - CTA:
   - Chamada para ação clara
   - Resumo do valor entregue
   - Instrução específica

2. **ELEMENTOS DE DESIGN**:
   - Hierarquia visual por slide
   - Sugestão de cores/contraste
   - Posicionamento de texto
   - Elementos gráficos

3. **COPYWRITING ESTRATÉGICO**:
   - Frases de impacto
   - Gatilhos mentais
   - Progressão lógica
   - Storytelling quando aplicável

4. **VARIAÇÕES**:
   - Versão educativa
   - Versão de vendas
   - Versão inspiracional

5. **DICAS DE PRODUÇÃO**:
   - Fontes recomendadas
   - Tamanho de texto ideal
   - Espaçamento
   - Legibilidade mobile

6. **ENGAJAMENTO**:
   - Perguntas para cada slide
   - Elementos interativos
   - Call-to-actions intermediários

Formate de forma clara, com cada slide numerado e pronto para design.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em criar carrosséis textuais para Instagram que geram alto engajamento e salvamentos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    })

    const carouselData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      carousel: carouselData,
      message: 'Carrossel textual gerado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar carrossel:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar carrossel textual' },
      { status: 500 }
    )
  }
}
