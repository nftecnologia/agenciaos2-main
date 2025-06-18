import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, targetAudience, mainKeyword, articleLength } = body;

    if (!title || !targetAudience) {
      return NextResponse.json(
        { error: "Título e público-alvo são obrigatórios" },
        { status: 400 }
      );
    }

    const lengthMap: Record<string, string> = {
      short: "500-800 palavras",
      medium: "1000-1500 palavras",
      long: "2000+ palavras"
    };

    const systemPrompt = `Você é um especialista em estruturação de conteúdo para blog e SEO.
    Crie uma estrutura detalhada e otimizada para SEO baseada nas informações fornecidas.`;

    const userPrompt = `Crie uma estrutura completa para o artigo:
    
    Título: ${title}
    Público-alvo: ${targetAudience}
    ${mainKeyword ? `Palavra-chave principal: ${mainKeyword}` : ""}
    Tamanho do artigo: ${lengthMap[articleLength || 'medium']}
    
    A estrutura deve incluir:
    1. Título principal (H1) otimizado
    2. Meta description sugestiva (máx 160 caracteres)
    3. Introdução com gancho inicial
    4. Estrutura de tópicos (H2, H3) organizados logicamente
    5. Sugestões de CTAs ao longo do texto
    6. Conclusão com próximos passos
    7. Sugestões de links internos/externos
    8. Perguntas frequentes (FAQ) relacionadas
    
    Retorne em formato JSON estruturado.`;

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
    console.error("Erro ao estruturar post:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
