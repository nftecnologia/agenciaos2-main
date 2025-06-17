import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      campaignObjective,
      targetAudience,
      region,
      budget,
      productService,
      additionalDetails 
    } = await request.json()

    const prompt = `Você é um especialista em Meta Ads e segmentação de público.
    
Com base nas seguintes informações:
- Objetivo da campanha: ${campaignObjective}
- Público-alvo geral: ${targetAudience}
- Região: ${region}
- Orçamento: ${budget || 'Não especificado'}
- Produto/Serviço: ${productService}
- Detalhes adicionais: ${additionalDetails || 'N/A'}

Gere sugestões detalhadas de segmentação para Meta Ads:

1. **Segmentação Demográfica**:
   - Idade (faixas específicas)
   - Gênero
   - Idioma
   - Nível educacional
   - Estado civil

2. **Segmentação Geográfica**:
   - Países/Estados/Cidades específicas
   - Raio de alcance
   - Tipo de localização (residencial, trabalho, viagem)

3. **Interesses Detalhados**:
   - Lista de 10-15 interesses principais
   - Combinações de interesses (AND/OR)
   - Interesses para excluir
   - Páginas relacionadas para seguir

4. **Comportamentos**:
   - Comportamentos de compra
   - Uso de dispositivos
   - Atividades digitais
   - Viajantes frequentes
   - Aniversários recentes

5. **Públicos Personalizados**:
   - Remarketing (visitantes do site)
   - Lista de clientes
   - Engajamento (Instagram/Facebook)
   - Vídeo (visualizações)

6. **Públicos Semelhantes (Lookalike)**:
   - Fonte ideal para lookalike
   - Percentual recomendado (1-10%)
   - Estratégia de expansão

7. **Exclusões Importantes**:
   - Públicos para excluir
   - Interesses conflitantes
   - Clientes atuais (se aplicável)

8. **Estratégia de Funil**:
   - Topo de funil
   - Meio de funil
   - Fundo de funil

9. **Dicas de Otimização**:
   - Tamanho ideal do público
   - Sobreposição a evitar
   - Frequência de atualização

Formate tudo pronto para copiar e colar no Meta Ads Manager.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um expert em segmentação de público para Meta Ads com anos de experiência."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2500,
    })

    const segmentationData = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      segmentation: segmentationData,
      message: 'Segmentação gerada com sucesso!'
    })

  } catch (error) {
    console.error('Erro ao gerar segmentação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar segmentação' },
      { status: 500 }
    )
  }
}
