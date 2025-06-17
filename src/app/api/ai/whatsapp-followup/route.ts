import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objective, context, lastInteraction, customerInfo } = body;

    if (!objective || !context) {
      return NextResponse.json(
        { error: "Objetivo e contexto são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em relacionamento com cliente via WhatsApp, crie mensagens de follow-up e reengajamento personalizadas.

OBJETIVO DO FOLLOW-UP: ${objective}
CONTEXTO: ${context}
${lastInteraction ? `ÚLTIMA INTERAÇÃO: ${lastInteraction}` : ""}
${customerInfo ? `INFORMAÇÕES DO CLIENTE: ${customerInfo}` : ""}

Gere mensagens para diferentes cenários:

${objective === 'retomar_contato' ? `
**RETOMAR CONTATO PARADO:**
1. Abordagem Sutil
2. Abordagem com Novidade
3. Abordagem com Benefício Exclusivo
` : ''}

${objective === 'lembrete_orcamento' ? `
**LEMBRETE DE ORÇAMENTO:**
1. Lembrete Amigável
2. Lembrete com Urgência
3. Lembrete com Desconto
` : ''}

${objective === 'agradecimento' ? `
**MENSAGEM DE AGRADECIMENTO:**
1. Agradecimento Simples
2. Agradecimento com Pedido de Feedback
3. Agradecimento com Indicação
` : ''}

${objective === 'pos_venda' ? `
**PÓS-VENDA:**
1. Verificação de Satisfação
2. Suporte Proativo
3. Upsell/Cross-sell Sutil
` : ''}

${objective === 'aniversario' ? `
**DATA ESPECIAL:**
1. Parabéns Personalizado
2. Parabéns com Presente
3. Parabéns com Desconto
` : ''}

${objective === 'recompra' ? `
**ESTÍMULO À RECOMPRA:**
1. Lembrete de Reposição
2. Oferta Especial de Fidelidade
3. Novidades Relacionadas
` : ''}

Para cada mensagem, inclua:
- Personalização com nome e contexto
- Tom adequado ao objetivo
- CTA claro mas não invasivo
- Timing ideal para envio

Adicione também:
- Melhor horário para enviar
- Intervalo ideal entre mensagens
- Sinais de quando parar o follow-up`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing de relacionamento, focado em criar mensagens de follow-up que fortalecem vínculos e geram resultados sem ser invasivo."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const messages = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error("Erro ao gerar mensagens de follow-up:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
