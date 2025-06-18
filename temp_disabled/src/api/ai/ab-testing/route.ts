import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      testElement,
      currentVersion,
      objective,
      audience,
      budget,
      duration
    } = await request.json()

    const prompt = `Você é um especialista em testes A/B e otimização de campanhas Meta Ads.
    
Com base nas seguintes informações:
- Elemento a testar: ${testElement} (headline/criativo/público/CTA/copy/etc)
- Versão atual: ${currentVersion}
- Objetivo do teste: ${objective}
- Público-alvo: ${audience}
- Orçamento disponível: ${budget || 'Não especificado'}
- Duração prevista: ${duration || '7 dias'}

Crie um plano completo de testes A/B:

1. **VARIAÇÕES PARA TESTE**:
   - Mínimo 3 variações diferentes
   - Máximo 5 variações
   - Justificativa para cada variação
   - Hipótese de performance

2. **ESTRUTURA DO TESTE**:
   - Tipo de teste (split test vs CBO)
   - Divisão de orçamento recomendada
   - Tamanho mínimo de amostra
   - Duração ideal do teste

3. **ELEMENTOS ESPECÍFICOS**:
   Para ${testElement}:
   - Variação A (controle): ${currentVersion}
   - Variação B: [nova versão]
   - Variação C: [nova versão]
   - Variação D: [nova versão] (se aplicável)
   - Variação E: [nova versão] (se aplicável)

4. **CRONOGRAMA**:
   - Fase 1: Preparação (o que fazer)
   - Fase 2: Lançamento (checklist)
   - Fase 3: Monitoramento (frequência)
   - Fase 4: Análise (quando parar)

5. **MÉTRICAS DE ACOMPANHAMENTO**:
   - KPIs principais
   - Métricas secundárias
   - Sinais de alerta
   - Quando escalar o vencedor

6. **CHECKLIST PRÉ-TESTE**:
   - [ ] Pixel instalado e funcionando
   - [ ] Públicos salvos
   - [ ] Criativos aprovados
   - [ ] Orçamento definido
   - [ ] Landing page otimizada
   - [ ] UTMs configuradas

7. **ANÁLISE ESTATÍSTICA**:
   - Nível de confiança necessário (95%)
   - Como calcular significância
   - Ferramentas recomendadas
   - Erros comuns a evitar

8. **TEMPLATE DE RELATÓRIO**:
   - Resumo executivo
   - Dados coletados
   - Análise de performance
   - Vencedor e justificativa
   - Próximos passos

9. **DICAS DE OTIMIZAÇÃO**:
   - Como evitar fadiga de anúncio
   - Quando parar um teste
   - Como escalar o vencedor
   - Testes subsequentes recomendados

Formate tudo de forma prática e executável.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em testes A/B para Meta Ads, com foco em metodologia científica e resultados mensuráveis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })

    const testPlan = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      testPlan: testPlan,
      message: 'Plano de testes A/B gerado com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar plano de testes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar plano de testes' },
      { status: 500 }
    )
  }
}
