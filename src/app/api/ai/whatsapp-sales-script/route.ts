import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, targetAudience, stage, objections } = body;

    if (!product || !targetAudience || !stage) {
      return NextResponse.json(
        { error: "Produto, público-alvo e etapa da venda são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em vendas via WhatsApp, crie scripts profissionais para cada etapa do processo comercial.

PRODUTO/SERVIÇO: ${product}
PÚBLICO-ALVO: ${targetAudience}
ETAPA DA VENDA: ${stage}
${objections ? `OBJEÇÕES COMUNS: ${objections}` : ""}

Crie scripts detalhados para a etapa selecionada:

${stage === 'abordagem' ? `
**SCRIPTS DE ABORDAGEM INICIAL:**
1. Abordagem Consultiva
2. Abordagem Direta
3. Abordagem por Indicação

Inclua:
- Quebra-gelo natural
- Identificação da necessidade
- Pergunta de qualificação
- Transição para próxima etapa
` : ''}

${stage === 'apresentacao' ? `
**SCRIPTS DE APRESENTAÇÃO:**
1. Apresentação Completa
2. Apresentação por Benefícios
3. Apresentação Comparativa

Inclua:
- Introdução do produto/serviço
- Principais benefícios (não características)
- Prova social ou cases
- Pergunta de interesse
` : ''}

${stage === 'objecao' ? `
**SCRIPTS PARA TRATAMENTO DE OBJEÇÕES:**
Para cada objeção comum, forneça:
1. Resposta Empática
2. Reversão com Benefício
3. Pergunta de Confirmação

Estrutura:
- Validação do sentimento
- Esclarecimento com fatos
- Reforço do valor
- Pergunta de avanço
` : ''}

${stage === 'fechamento' ? `
**SCRIPTS DE FECHAMENTO:**
1. Fechamento Assumptivo
2. Fechamento por Urgência
3. Fechamento Consultivo

Inclua:
- Resumo dos benefícios acordados
- Proposta clara de ação
- Criação de urgência (se aplicável)
- Próximos passos concretos
` : ''}

Para cada script, adicione:
- Perguntas poderosas para engajar
- Gatilhos mentais apropriados
- Momentos de pausa estratégica
- Alternativas se o cliente hesitar`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em vendas consultivas com profundo conhecimento em psicologia de vendas e comunicação persuasiva via WhatsApp."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const scripts = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { scripts },
    });
  } catch (error) {
    console.error("Erro ao gerar scripts de vendas:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
