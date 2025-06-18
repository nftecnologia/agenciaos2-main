import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, topic, currentYear } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório" },
        { status: 400 }
      );
    }

    const systemPrompt = `Você é um especialista em atualização e melhoria de conteúdo.
    Analise o conteúdo fornecido e sugira atualizações para mantê-lo relevante e atual.`;

    const userPrompt = `Analise o seguinte conteúdo e sugira atualizações:
    
    ${topic ? `Tópico: ${topic}` : ""}
    Ano atual: ${currentYear || new Date().getFullYear()}
    
    Conteúdo original:
    ${content}
    
    Forneça sugestões de atualização em formato JSON:
    {
      "outdatedSections": [
        {
          "original": "texto original desatualizado",
          "updated": "versão atualizada sugerida",
          "reason": "motivo da atualização"
        }
      ],
      "newSections": [
        {
          "title": "título da nova seção",
          "content": "conteúdo sugerido",
          "placement": "onde inserir (após qual seção)"
        }
      ],
      "statistics": {
        "old": ["estatísticas desatualizadas encontradas"],
        "new": ["estatísticas atualizadas sugeridas"]
      },
      "trends": ["tendências atuais do tópico para incluir"],
      "removeSuggestions": ["seções ou informações obsoletas para remover"],
      "seoUpdates": {
        "keywords": ["novas palavras-chave relevantes"],
        "title": "sugestão de novo título se necessário"
      },
      "priority": "alta/média/baixa - urgência de atualização"
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
    console.error("Erro ao atualizar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
