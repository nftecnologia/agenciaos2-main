import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { niche, painPoint, format, targetPrice } = body;

    if (!niche || !painPoint || !format || !targetPrice) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em criação de produtos digitais e infoprodutos, crie um produto principal completo e estratégico.

NICHO: ${niche}
DOR/PROBLEMA: ${painPoint}
FORMATO: ${format}
PREÇO-ALVO: ${targetPrice}

Desenvolva um produto completo incluindo:

1. **PROPOSTA DE VALOR:**
   - Headline principal (máximo 100 caracteres)
   - Promessa transformadora clara
   - Diferencial único (USP)

2. **ESTRUTURA DO PRODUTO:**
${format === 'curso' ? `
   - Módulos principais (5-8 módulos)
   - Aulas por módulo (títulos específicos)
   - Duração estimada
   - Bônus inclusos
` : format === 'ebook' ? `
   - Capítulos principais (8-12 capítulos)
   - Tópicos por capítulo
   - Número de páginas estimado
   - Recursos adicionais (checklists, templates)
` : format === 'saas' ? `
   - Funcionalidades principais
   - Planos e limites
   - Integrações disponíveis
   - Diferenciais técnicos
` : format === 'mentoria' ? `
   - Duração do programa
   - Frequência de encontros
   - Formato (grupo/individual)
   - Entregáveis inclusos
` : `
   - Especificações detalhadas
   - Componentes/características
   - Garantias oferecidas
   - Diferenciais do produto
`}

3. **IDENTIDADE COMERCIAL:**
   - Nome do produto (criativo e memorável)
   - Tagline (máximo 50 caracteres)
   - 5 benefícios tangíveis principais
   - 3 transformações prometidas

4. **JUSTIFICATIVA DE PREÇO:**
   - Âncora de preço (comparação com alternativas)
   - Cálculo de ROI para o cliente
   - Elementos que agregam valor percebido
   - Estratégia de posicionamento (premium/acessível)

5. **ELEMENTOS DE CONVERSÃO:**
   - Garantia oferecida
   - Escassez/urgência sugerida
   - Prova social necessária
   - CTA principal

Formate a resposta de forma clara e pronta para implementação.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de produtos digitais especializado em criar ofertas irresistíveis que resolvem problemas reais e geram alto valor percebido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const productPlan = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { productPlan },
    });
  } catch (error) {
    console.error("Erro ao criar produto principal:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
