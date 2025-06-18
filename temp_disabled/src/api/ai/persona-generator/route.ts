import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      businessSegment,
      averageTicket,
      clientType,
      audienceProblems,
      region,
      additionalInfo 
    } = await request.json()

    const prompt = `Você é um especialista em marketing e criação de personas.
    
Com base nas seguintes informações:
- Segmento do negócio: ${businessSegment}
- Ticket médio: ${averageTicket}
- Tipo de cliente: ${clientType}
- Problemas/desejos do público: ${audienceProblems}
- Região: ${region}
- Informações adicionais: ${additionalInfo || 'N/A'}

Crie uma persona detalhada com:

1. **Dados Demográficos**:
   - Nome fictício
   - Idade
   - Gênero
   - Estado civil
   - Profissão
   - Renda mensal
   - Localização

2. **Psicográficos**:
   - Personalidade
   - Valores
   - Interesses
   - Estilo de vida
   - Hobbies

3. **Comportamento**:
   - Rotina diária
   - Hábitos de consumo
   - Canais favoritos (redes sociais, mídia)
   - Como pesquisa produtos/serviços
   - Influenciadores que segue

4. **Dores e Necessidades**:
   - Principais problemas/frustrações
   - Necessidades não atendidas
   - Objeções de compra
   - Medos e preocupações

5. **Objetivos e Sonhos**:
   - Metas de curto prazo
   - Aspirações de longo prazo
   - O que valoriza em uma solução

6. **Mini Storytelling**:
   - Uma breve história de um dia na vida dessa persona
   - Como o produto/serviço se encaixa em sua rotina

7. **Insights para Marketing**:
   - Gatilhos mentais mais efetivos
   - Tipo de conteúdo que engaja
   - Melhores horários para comunicação
   - Tom de voz ideal

Formate a resposta de forma clara e estruturada.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em criação de personas detalhadas para marketing digital."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const personaData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      persona: personaData,
      message: 'Persona gerada com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar persona:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar persona' },
      { status: 500 }
    )
  }
}
