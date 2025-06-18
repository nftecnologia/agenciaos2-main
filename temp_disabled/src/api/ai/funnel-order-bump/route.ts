import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mainProduct, objective, mainPrice } = body;

    if (!mainProduct || !objective) {
      return NextResponse.json(
        { error: "Produto principal e objetivo são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em estratégias de order bump e maximização de AOV, crie uma oferta complementar irresistível.

PRODUTO PRINCIPAL: ${mainProduct}
OBJETIVO DO BUMP: ${objective}
${mainPrice ? `PREÇO DO PRODUTO PRINCIPAL: ${mainPrice}` : ""}

Desenvolva order bumps estratégicos:

1. **BUMP PRINCIPAL (Maior Conversão):**
   - Nome do complemento (curto e direto)
   - Tipo de entrega (checklist, template, mini-curso, extensão)
   - Proposta de valor em 1 linha
   - Preço sugerido (10-30% do principal)
   - Benefício imediato claro

2. **BUMP ALTERNATIVO (Maior Ticket):**
   - Nome do complemento premium
   - Tipo de entrega
   - Proposta de valor diferenciada
   - Preço sugerido (20-40% do principal)
   - Benefício exclusivo

3. **COPY PARA CHECKBOX:**
   Para cada bump, forneça:
   - Título do checkbox (máximo 60 caracteres)
   - Descrição persuasiva (2-3 linhas)
   - Gatilho de urgência/escassez
   - Preço original riscado + preço promocional

4. **ELEMENTOS DE CONVERSÃO:**
   - Âncora de valor (comparação)
   - Garantia específica do bump
   - Razão para agir agora
   - Economia destacada

5. **ESTRATÉGIA DE IMPLEMENTAÇÃO:**
   - Melhor posicionamento no checkout
   - Cor/destaque visual sugerido
   - A/B test recomendado
   - Meta de conversão esperada

Formato exemplo para copy do checkbox:
"✓ SIM! Quero adicionar [NOME] por apenas R$ [PREÇO] (valor normal R$ [PREÇO RISCADO])
[DESCRIÇÃO BREVE COM BENEFÍCIO PRINCIPAL]"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em otimização de checkout e order bumps, focado em criar ofertas complementares que aumentam o ticket médio sem criar atrito na compra principal."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const orderBumps = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { orderBumps },
    });
  } catch (error) {
    console.error("Erro ao criar order bumps:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
