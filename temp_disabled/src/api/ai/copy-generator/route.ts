import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      objective,
      product,
      persona,
      tone,
      benefits,
      painPoints,
      offer
    } = await request.json()

    const prompt = `Você é um copywriter especialista em Meta Ads com histórico comprovado de alta conversão.
    
Com base nas seguintes informações:
- Objetivo da campanha: ${objective}
- Produto/Serviço: ${product}
- Persona alvo: ${persona}
- Tom desejado: ${tone} (urgência/autoridade/emocional/benefício/escassez)
- Principais benefícios: ${benefits || 'N/A'}
- Dores do cliente: ${painPoints || 'N/A'}
- Oferta especial: ${offer || 'N/A'}

Crie copies otimizadas para Meta Ads seguindo RIGOROSAMENTE estes limites:

1. **HEADLINE (Título Principal)**:
   - MÁXIMO 40 caracteres
   - 3 variações diferentes
   - Deve capturar atenção imediatamente
   - Use números, perguntas ou promessas

2. **TEXTO PRIMÁRIO**:
   - MÁXIMO 125 caracteres
   - 3 variações diferentes
   - Direto ao ponto
   - Foque no benefício principal
   - Inclua gatilho mental do tom escolhido

3. **DESCRIÇÃO**:
   - MÁXIMO 30 caracteres
   - 3 variações diferentes
   - Complemento do headline
   - Reforce a proposta de valor

4. **CTAs (Call-to-Action)**:
   - 5 opções diferentes
   - Verbos de ação
   - Senso de urgência
   - Personalizados para o objetivo

5. **TESTES A/B SUGERIDOS**:
   - Combinações recomendadas
   - Hipóteses de teste
   - Métricas para acompanhar

6. **DICAS DE OTIMIZAÇÃO**:
   - Emojis recomendados (se aplicável)
   - Melhores práticas específicas
   - Palavras a evitar (políticas Meta)

IMPORTANTE: 
- Respeite RIGOROSAMENTE os limites de caracteres
- Use linguagem persuasiva mas natural
- Evite termos que violem políticas do Meta
- Foque em benefícios, não características
- Crie urgência sem ser spam

Formate a resposta de forma clara e organizada.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um copywriter expert em Meta Ads, especializado em criar textos de alta conversão respeitando todos os limites de caracteres."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const copyData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      copies: copyData,
      message: 'Copies geradas com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar copies:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar copies' },
      { status: 500 }
    )
  }
}
