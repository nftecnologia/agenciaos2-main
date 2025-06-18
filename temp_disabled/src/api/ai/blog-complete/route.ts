import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      niche, 
      topic,
      mainKeyword, 
      secondaryKeywords,
      targetAudience, 
      objective,
      tone,
      wordCount,
      additionalInfo 
    } = body;

    if (!niche || !topic || !mainKeyword || !targetAudience) {
      return NextResponse.json(
        { error: "Nicho, tema, palavra-chave principal e público-alvo são obrigatórios" },
        { status: 400 }
      );
    }

    const wordCountMap: Record<string, string> = {
      "500": "500-800 palavras",
      "1000": "1000-1500 palavras",
      "2000": "2000-2500 palavras",
      "3000": "3000+ palavras"
    };

    const systemPrompt = `Você é um redator expert em SEO e marketing de conteúdo.
    Crie artigos completos, bem estruturados, otimizados para SEO e envolventes.
    Use uma abordagem que combine informação valiosa com persuasão sutil.`;

    const userPrompt = `Crie um artigo completo com as seguintes especificações:
    
    Nicho: ${niche}
    Tema: ${topic}
    Palavra-chave principal: ${mainKeyword}
    ${secondaryKeywords ? `Palavras-chave secundárias: ${secondaryKeywords}` : ""}
    Público-alvo: ${targetAudience}
    Objetivo: ${objective || "Atrair tráfego e educar"}
    Tom de voz: ${tone || "Conversacional"}
    Tamanho: ${wordCountMap[wordCount || "1000"]}
    ${additionalInfo ? `Informações adicionais: ${additionalInfo}` : ""}
    
    Retorne um JSON completo com:
    {
      "article": {
        "title": "título otimizado (H1)",
        "introduction": "introdução com gancho persuasivo",
        "sections": [
          {
            "heading": "título da seção (H2)",
            "content": "conteúdo da seção",
            "subSections": [
              {
                "heading": "subtítulo (H3)",
                "content": "conteúdo da subseção"
              }
            ]
          }
        ],
        "conclusion": "conclusão com CTA",
        "faq": [
          {
            "question": "pergunta frequente",
            "answer": "resposta completa"
          }
        ]
      },
      "seo": {
        "metaTitle": "título SEO (máx 60 caracteres)",
        "metaDescription": "meta description (140-160 caracteres)",
        "slug": "url-amigavel",
        "keywordDensity": "X%",
        "readabilityScore": "score de legibilidade"
      },
      "enhancements": {
        "internalLinks": ["sugestões de links internos"],
        "externalLinks": ["links externos confiáveis"],
        "ctas": ["CTAs sugeridos ao longo do texto"],
        "images": [
          {
            "placement": "onde inserir",
            "description": "descrição para buscar/criar imagem",
            "altText": "texto alternativo SEO"
          }
        ]
      },
      "socialMedia": {
        "tldr": "resumo de 2-3 linhas para redes sociais",
        "linkedinIntro": "introdução para LinkedIn",
        "twitterThread": ["tweets para thread"],
        "openGraph": {
          "title": "título para compartilhamento",
          "description": "descrição social"
        }
      },
      "checklist": {
        "seoScore": 85,
        "issues": ["problemas encontrados"],
        "improvements": ["melhorias sugeridas"]
      }
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao gerar artigo completo:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
