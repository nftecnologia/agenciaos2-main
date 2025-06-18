import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, service, targetAudience, existingContent } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Tema é obrigatório" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um especialista em criar conteúdo FAQ e listas informativas.
    Gere perguntas frequentes relevantes e listas úteis baseadas no contexto fornecido.`;

    const userPrompt = `Crie FAQs e listas para o tema: ${topic}
    
    ${service ? `Serviço/Produto: ${service}` : ""}
    ${targetAudience ? `Público-alvo: ${targetAudience}` : ""}
    ${existingContent ? `Contexto adicional: ${existingContent.substring(0, 300)}...` : ""}
    
    Gere em formato JSON:
    {
      "faqs": [
        {
          "question": "pergunta relevante e natural",
          "answer": "resposta completa e informativa",
          "keywords": ["palavras-chave relacionadas"]
        }
      ],
      "lists": {
        "tips": {
          "title": "X Dicas para...",
          "items": ["dica 1", "dica 2", ...]
        },
        "benefits": {
          "title": "Benefícios de...",
          "items": ["benefício 1", "benefício 2", ...]
        },
        "commonMistakes": {
          "title": "Erros Comuns ao...",
          "items": ["erro 1", "erro 2", ...]
        },
        "steps": {
          "title": "Passo a Passo para...",
          "items": ["passo 1", "passo 2", ...]
        }
      },
      "schemaMarkup": {
        "faqSchema": "código JSON-LD para FAQ Schema",
        "howToSchema": "código JSON-LD para HowTo Schema se aplicável"
      }
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
    console.error("Erro ao gerar FAQs:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
