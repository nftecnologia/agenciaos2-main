import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, mainKeyword, secondaryKeywords } = body;

    if (!content || !mainKeyword) {
      return NextResponse.json(
        { error: "Conteúdo e palavra-chave principal são obrigatórios" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um especialista em SEO e otimização de conteúdo.
    Analise o conteúdo fornecido e sugira melhorias para maximizar o ranqueamento nos buscadores.`;

    const userPrompt = `Analise o seguinte conteúdo e forneça sugestões de otimização SEO:
    
    Palavra-chave principal: ${mainKeyword}
    ${secondaryKeywords ? `Palavras-chave secundárias: ${secondaryKeywords}` : ""}
    
    Conteúdo:
    ${content}
    
    Forneça análise e sugestões em formato JSON:
    {
      "seoScore": número de 0-100,
      "keywordDensity": {
        "main": "porcentagem da palavra-chave principal",
        "secondary": ["densidade de cada palavra secundária"]
      },
      "improvements": {
        "title": "sugestão de título otimizado",
        "metaDescription": "meta description de 140-160 caracteres",
        "headings": ["sugestões de H2/H3 otimizados"],
        "internalLinks": ["sugestões de links internos"],
        "externalLinks": ["sugestões de links externos confiáveis"],
        "contentGaps": ["tópicos que poderiam ser adicionados"],
        "readability": "análise de legibilidade e sugestões"
      },
      "faq": [
        {
          "question": "pergunta frequente relacionada",
          "answer": "resposta otimizada"
        }
      ],
      "lsiKeywords": ["palavras-chave LSI recomendadas"],
      "actionItems": ["lista de ações prioritárias para melhorar SEO"]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao otimizar SEO:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
