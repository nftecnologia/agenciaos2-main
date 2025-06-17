import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mainProduct, revenueGoal, mainPrice, customerProfile } = body;

    if (!mainProduct || !revenueGoal) {
      return NextResponse.json(
        { error: "Produto principal e meta de faturamento são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em estratégias de upsell e maximização de LTV, crie ofertas premium irresistíveis.

PRODUTO PRINCIPAL: ${mainProduct}
META DE FATURAMENTO: ${revenueGoal}
${mainPrice ? `PREÇO DO PRODUTO PRINCIPAL: ${mainPrice}` : ""}
${customerProfile ? `PERFIL DO CLIENTE: ${customerProfile}` : ""}

Desenvolva upsells estratégicos:

1. **UPSELL PREMIUM (Maior Valor):**
   - Nome da oferta premium
   - Tipo (coaching, versão PRO, assinatura anual, bundle completo)
   - Estrutura detalhada de conteúdo/benefícios extras
   - Preço sugerido (50-200% acima do principal)
   - ROI prometido ao cliente

2. **UPSELL CONTINUIDADE (Recorrência):**
   - Nome do programa de continuidade
   - Formato (assinatura mensal, clube VIP, mentoria)
   - Benefícios exclusivos mensais
   - Preço mensal sugerido
   - Valor do lifetime value

3. **PÁGINA DE UPSELL - ESTRUTURA:**
   - Headline principal (máximo 100 caracteres)
   - Subheadline de suporte
   - 5 bullets principais de benefícios
   - Âncora de preço (comparação de valor)
   - Garantia estendida/diferenciada
   - CTA principal e alternativo

4. **COPY PERSUASIVA:**
   - Parabéns pela compra (reconhecimento)
   - Transição para oportunidade única
   - História/caso de sucesso
   - Urgência/escassez genuína
   - Reversão de risco total

5. **ELEMENTOS DE CONVERSÃO:**
   - Prova social específica
   - Demonstração de resultados
   - Bônus exclusivos do upsell
   - Timer de oferta limitada
   - Opção "Não, obrigado" psicológica

6. **ESTRATÉGIA DE PREÇO:**
   - Preço âncora (valor real)
   - Preço promocional
   - Opções de parcelamento
   - Economia destacada
   - Justificativa do desconto

Meta de conversão: 30-40% dos compradores do produto principal`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de funis de alta conversão, especializado em criar upsells que agregam valor genuíno e maximizam o lifetime value do cliente."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const upsellStrategy = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { upsellStrategy },
    });
  } catch (error) {
    console.error("Erro ao criar estratégia de upsell:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
