import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, mainKeyword } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um especialista em SEO e copywriting.
    Crie meta descriptions persuasivas e slugs otimizados para SEO.`;

    const userPrompt = `Com base no seguinte artigo, crie:
    
    Título: ${title}
    ${mainKeyword ? `Palavra-chave principal: ${mainKeyword}` : ""}
    
    Conteúdo (resumo):
    ${content.substring(0, 500)}...
    
    Gere em formato JSON:
    {
      "metaDescriptions": [
        {
          "text": "meta description de 140-160 caracteres",
          "length": número de caracteres,
          "style": "estilo (persuasivo/informativo/urgente)"
        }
      ],
      "slugs": [
        {
          "slug": "url-amigavel-para-seo",
          "reasoning": "por que este slug é efetivo"
        }
      ],
      "openGraph": {
        "title": "título para redes sociais",
        "description": "descrição para compartilhamento social"
      },
      "tips": ["dicas para melhorar CTR e engajamento"]
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
    console.error("Erro ao gerar meta tags:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
