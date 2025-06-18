import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { objective, product, tone, duration } = body;

    if (!objective || !product) {
      return NextResponse.json(
        { error: "Objetivo e produto/serviço são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em comunicação por áudio no WhatsApp, crie roteiros para gravação de áudios profissionais e eficazes.

OBJETIVO DO ÁUDIO: ${objective}
PRODUTO/SERVIÇO: ${product}
TOM DESEJADO: ${tone || "Amigável e profissional"}
DURAÇÃO APROXIMADA: ${duration || "30-60 segundos"}

Crie 3 roteiros diferentes:

1. **Roteiro Principal** - Abordagem completa e detalhada
2. **Roteiro Alternativo** - Abordagem mais direta e objetiva
3. **Roteiro Rápido** - Versão curta para mensagens urgentes

Para cada roteiro, inclua:
- [ABERTURA]: Saudação natural e contextualização
- [DESENVOLVIMENTO]: Apresentação clara do benefício/proposta
- [INSTRUÇÕES]: Passos claros do que o cliente deve fazer
- [ENCERRAMENTO]: CTA e despedida cordial

Adicione também:
- Dicas de entonação e pausas
- Palavras-chave a enfatizar
- Tempo estimado de gravação
- Sugestões para soar natural e envolvente

Evite:
- Falar muito rápido ou muito devagar
- Termos técnicos desnecessários
- Mensagens genéricas ou robotizadas`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em comunicação por áudio, com experiência em criar roteiros que soam naturais, persuasivos e geram conexão emocional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const scripts = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { scripts },
    });
  } catch (error) {
    console.error("Erro ao gerar roteiros de áudio:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
