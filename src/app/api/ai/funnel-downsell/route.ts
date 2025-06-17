import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mainProduct, rejectionReason, mainPrice, upsellRejected } = body;

    if (!mainProduct || !rejectionReason) {
      return NextResponse.json(
        { error: "Produto principal e motivo da rejeição são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em recuperação de vendas e downsell, crie ofertas de recuperação que convertem objeções em vendas.

PRODUTO PRINCIPAL: ${mainProduct}
MOTIVO DA REJEIÇÃO: ${rejectionReason}
${mainPrice ? `PREÇO ORIGINAL: ${mainPrice}` : ""}
${upsellRejected ? `UPSELL REJEITADO: ${upsellRejected}` : ""}

Desenvolva estratégias de downsell:

1. **DOWNSELL PRINCIPAL (Maior Conversão):**
   - Nome da oferta enxuta
   - Formato reduzido (plano lite, versão básica, trial)
   - O que está incluído vs. o que foi removido
   - Preço sugerido (40-70% menor que o original)
   - Proposta de valor mantida

2. **DOWNSELL PARCELADO (Remover Objeção de Preço):**
   - Mesma oferta principal
   - Opções de parcelamento estendido
   - Entrada reduzida ou zero
   - Valor das parcelas
   - Benefício do parcelamento

3. **DOWNSELL TRIAL (Remover Risco):**
   - Período de teste (7, 14 ou 30 dias)
   - Valor simbólico ou gratuito
   - O que está incluído no trial
   - Conversão automática explicada
   - Garantias oferecidas

4. **COPY DE RECUPERAÇÃO:**
   - Headline empática com a objeção
   - Reconhecimento do problema
   - Solução alternativa apresentada
   - Benefícios mantidos destacados
   - CTA de última chance

5. **ELEMENTOS PSICOLÓGICOS:**
   - Validação da preocupação do cliente
   - Reforço do problema original
   - Prova social de quem começou pequeno
   - Urgência genuína (última oportunidade)
   - Facilidade de upgrade futuro

6. **ESTRATÉGIA DE IMPLEMENTAÇÃO:**
   - Timing do downsell (imediato vs. email)
   - Sequência de follow-up se recusar
   - Limite de tentativas
   - Mensagem de saída elegante

Exemplo de copy:
"Entendo que [OBJEÇÃO]. Por isso, criei uma opção especial para você começar com menos risco..."`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em psicologia de vendas e recuperação de carrinho abandonado, focado em transformar objeções em oportunidades de venda através de ofertas adaptadas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const downsellStrategy = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { downsellStrategy },
    });
  } catch (error) {
    console.error("Erro ao criar estratégia de downsell:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
