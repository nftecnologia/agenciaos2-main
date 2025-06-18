import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supportType, issue, businessType, tone } = body;

    if (!supportType || !issue) {
      return NextResponse.json(
        { error: "Tipo de atendimento e problema são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Como especialista em atendimento ao cliente via WhatsApp, crie scripts de suporte profissionais, empáticos e resolutivos.

TIPO DE ATENDIMENTO: ${supportType}
PROBLEMA/SITUAÇÃO: ${issue}
${businessType ? `TIPO DE NEGÓCIO: ${businessType}` : ""}
TOM DESEJADO: ${tone || "Empático e profissional"}

Crie scripts específicos para o tipo de atendimento:

${supportType === 'duvida_tecnica' ? `
**SCRIPTS PARA DÚVIDAS TÉCNICAS:**
1. Abordagem Didática
2. Abordagem Passo a Passo
3. Abordagem com Recursos Visuais

Estrutura:
- Confirmação do problema
- Explicação clara e simples
- Passo a passo da solução
- Verificação de entendimento
- Oferta de suporte adicional
` : ''}

${supportType === 'reclamacao' ? `
**SCRIPTS PARA RECLAMAÇÕES:**
1. Resposta Empática Imediata
2. Resposta com Solução Rápida
3. Resposta com Compensação

Estrutura:
- Acolhimento e empatia
- Pedido de desculpas sincero
- Investigação respeitosa
- Proposta de solução
- Acompanhamento prometido
` : ''}

${supportType === 'orientacao' ? `
**SCRIPTS PARA ORIENTAÇÃO DE USO:**
1. Tutorial Completo
2. Dicas Rápidas
3. Melhores Práticas

Estrutura:
- Boas-vindas calorosas
- Instruções claras e numeradas
- Dicas de otimização
- Recursos adicionais
- Disponibilidade para dúvidas
` : ''}

${supportType === 'desculpas' ? `
**SCRIPTS PARA PEDIDO DE DESCULPAS:**
1. Desculpas Formais
2. Desculpas com Explicação
3. Desculpas com Ação Corretiva

Estrutura:
- Reconhecimento do erro
- Pedido de desculpas genuíno
- Explicação sem desculpas
- Ação corretiva imediata
- Garantia de não repetição
` : ''}

Para cada script, inclua:
- Frases de empatia apropriadas
- Linguagem clara e acessível
- Momentos para ouvir o cliente
- Encerramento positivo
- Pesquisa de satisfação

Adicione também:
- Sinais de quando escalar o atendimento
- Alternativas se a primeira solução não funcionar
- Como manter a calma em situações difíceis`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em atendimento ao cliente com vasta experiência em resolver problemas, acalmar clientes insatisfeitos e transformar experiências negativas em positivas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const scripts = completion.choices[0].message.content || "";

    return NextResponse.json({
      success: true,
      data: { scripts },
    });
  } catch (error) {
    console.error("Erro ao gerar scripts de suporte:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
