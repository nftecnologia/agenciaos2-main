import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { niche, targetAudience, keywords, objectives } = body;

    if (!niche || !targetAudience) {
      return NextResponse.json(
        { error: "Nicho e público-alvo são obrigatórios" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um especialista em marketing de conteúdo e SEO.
    Gere ideias criativas e relevantes de artigos para blog baseadas nas informações fornecidas.
    Para cada ideia, forneça:
    1. Título otimizado para SEO (máximo 60 caracteres)
    2. Abordagem sugerida (lista, tutorial, análise, opinião, etc.)
    3. Palavras-chave relacionadas
    4. Potencial de engajamento (alto/médio/baixo)`;

    const userPrompt = `Gere 10 ideias de artigos para blog com as seguintes características:
    
    Nicho: ${niche}
    Público-alvo: ${targetAudience}
    ${keywords ? `Palavras-chave: ${keywords}` : ""}
    ${objectives?.length ? `Objetivos: ${objectives.join(", ")}` : ""}
    
    Retorne em formato JSON com a estrutura:
    {
      "ideas": [
        {
          "title": "título do artigo",
          "approach": "tipo de abordagem",
          "keywords": ["palavra1", "palavra2"],
          "engagementPotential": "alto/médio/baixo",
          "reasoning": "breve explicação do porquê essa ideia é boa"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao gerar ideias de blog:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
