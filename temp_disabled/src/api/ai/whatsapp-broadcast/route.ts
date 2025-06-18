import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objective, audience, tone, details } = body;

    if (!objective || !audience) {
      return NextResponse.json(
        { error: "Objetivo e público-alvo são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em campanhas de WhatsApp, crie mensagens de lista/broadcast profissionais.

OBJETIVO DA CAMPANHA: ${objective}
PÚBLICO-ALVO: ${audience}
TOM DA MENSAGEM: ${tone || "Profissional e amigável"}
${details ? `DETALHES ADICIONAIS: ${details}` : ""}

Gere 3 variações de mensagens para evitar repetição, incluindo:
1. Mensagem principal clara e objetiva (máximo 1024 caracteres)
2. Versão alternativa com abordagem diferente
3. Versão resumida para reengajamento rápido

Para cada mensagem, inclua:
- Saudação personalizada
- Apresentação do valor/benefício principal
- CTA (Call to Action) claro
- Fechamento profissional

Evite:
- Spam ou linguagem agressiva
- Mensagens muito longas
- Repetição excessiva
- Caracteres especiais em excesso

Formato da resposta:
**Mensagem Principal:**
[Mensagem]

**Variação Alternativa:**
[Mensagem]

**Versão Resumida:**
[Mensagem]

**Dicas de Envio:**
- [Dica sobre melhor horário]
- [Dica sobre segmentação]
- [Dica sobre frequência]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing digital focado em campanhas de WhatsApp, com experiência em criar mensagens que geram alto engajamento e evitam bloqueios."
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
    console.error("Erro ao gerar mensagens de broadcast:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
