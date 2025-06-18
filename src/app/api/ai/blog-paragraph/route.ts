import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, section, targetAudience, tone, context } = body;

    if (!topic || !section) {
      return NextResponse.json(
        { error: "Tema e seção são obrigatórios" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um redator especializado em criar conteúdo envolvente e informativo para blog.
    Escreva parágrafos bem estruturados, com linguagem adequada ao público-alvo.
    Use exemplos, dados e argumentos relevantes para fortalecer o conteúdo.`;

    const userPrompt = `Desenvolva ${section} sobre o tema: ${topic}
    
    Público-alvo: ${targetAudience || "Geral"}
    Tom de voz: ${tone || "Conversacional"}
    ${context ? `Contexto adicional: ${context}` : ""}
    
    Instruções:
    1. Escreva 2-3 parágrafos bem desenvolvidos
    2. Inclua exemplos práticos quando relevante
    3. Use dados ou estatísticas se apropriado
    4. Mantenha frases claras e concisas
    5. Evite jargões desnecessários
    6. Inclua transições suaves entre ideias
    
    Retorne em formato JSON com:
    {
      "paragraphs": ["parágrafo 1", "parágrafo 2", ...],
      "examples": ["exemplo 1", "exemplo 2", ...],
      "keyPoints": ["ponto chave 1", "ponto chave 2", ...],
      "suggestions": "sugestões para expandir ou melhorar o conteúdo"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao gerar parágrafos:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
