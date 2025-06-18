import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, businessType, tone } = body;

    if (!questions || !businessType) {
      return NextResponse.json(
        { error: "Perguntas frequentes e tipo de negócio são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em atendimento ao cliente via WhatsApp, crie respostas rápidas (templates) profissionais e humanizadas.

PERGUNTAS/SITUAÇÕES FREQUENTES: ${questions}
TIPO DE NEGÓCIO: ${businessType}
TOM DE COMUNICAÇÃO: ${tone || "Cordial e profissional"}

Para cada pergunta/situação, gere:
1. **Resposta Principal** - Completa e detalhada
2. **Resposta Alternativa** - Variação com abordagem diferente
3. **Resposta Rápida** - Versão super concisa

Estrutura das respostas:
- Cumprimento personalizado (quando apropriado)
- Resposta clara e direta
- Informação adicional relevante
- Próximos passos ou CTA
- Despedida cordial

Características importantes:
- Máximo 500 caracteres por resposta
- Linguagem simples e acessível
- Emojis estratégicos (sem exageros)
- Personalização com [NOME] onde aplicável
- Clareza nas informações

Adicione também:
- Sugestões de personalização
- Momentos ideais para usar cada variação
- Dicas para tornar a resposta mais humana`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em atendimento ao cliente, focado em criar templates de resposta que são eficientes, humanizados e geram satisfação do cliente."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const templates = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error("Erro ao gerar templates:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
