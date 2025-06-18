// OpenAI Configuration with fallbacks for development
export interface OpenAIConfig {
  apiKey?: string
  enabled: boolean
}

export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY
  
  return {
    apiKey,
    enabled: !!apiKey && apiKey.trim() !== '',
  }
}

// Mock responses for development when OpenAI is not available
export const mockResponses = {
  blogIdeas: [
    'Como aumentar vendas usando IA em 2024',
    'Top 10 ferramentas de automação para agências',
    'Estratégias de marketing digital que realmente funcionam',
    'Como criar conteúdo viral para redes sociais',
    'O futuro das agências digitais com IA'
  ],
  
  instagramCaption: `🚀 Transforme sua agência com IA!

Descubra como a inteligência artificial pode revolucionar seus resultados:

✨ Automação de processos
📈 Análise de dados em tempo real
🎯 Segmentação precisa de público
💰 ROI otimizado

#IA #MarketingDigital #Agencia #Automacao #Resultados`,

  whatsappScript: `Olá! 👋

Espero que esteja tudo bem com você!

Sou [Seu Nome] da [Nome da Agência] e tenho uma proposta que pode transformar seus resultados online.

Nossos clientes têm alcançado:
• 150% de aumento em leads
• 80% de redução em custos
• 200% de melhoria no ROI

Que tal conversarmos por 15 minutos sobre como podemos ajudar sua empresa?

Quando seria um bom horário para você? 📅`,

  seoOptimization: `# Otimização SEO Recomendada

## Title Tags
- Mantenha entre 50-60 caracteres
- Inclua palavra-chave principal no início
- Use chamadas para ação

## Meta Descriptions
- 150-160 caracteres ideais
- Inclua palavra-chave e benefício
- Crie senso de urgência

## Headers (H1, H2, H3)
- Use apenas um H1 por página
- Estruture hierarquicamente
- Inclua palavras-chave relacionadas

## Conteúdo
- Mínimo 300 palavras
- Densidade de palavra-chave 1-2%
- Use sinônimos e variações`,

  funnelStrategy: `# Estratégia de Funil de Vendas

## Topo do Funil (TOFU)
- Conteúdo educativo
- Posts em blog
- Redes sociais
- SEO orgânico

## Meio do Funil (MOFU)
- E-books gratuitos
- Webinars
- Casos de sucesso
- Comparativos

## Fundo do Funil (BOFU)
- Demonstrações
- Consultoria gratuita
- Propostas personalizadas
- Depoimentos

## Métricas de Acompanhamento
- Taxa de conversão por etapa
- Custo por lead (CPL)
- Lifetime Value (LTV)
- ROI do funil`
}

// Simple text generation function with fallback
export async function generateText(prompt: string, type: 'blog' | 'instagram' | 'whatsapp' | 'seo' | 'funnel' = 'blog'): Promise<string> {
  const config = getOpenAIConfig()
  
  if (!config.enabled) {
    // Return mock response based on type
    switch (type) {
      case 'instagram':
        return mockResponses.instagramCaption
      case 'whatsapp':
        return mockResponses.whatsappScript
      case 'seo':
        return mockResponses.seoOptimization
      case 'funnel':
        return mockResponses.funnelStrategy
      default:
        return `# Conteúdo Gerado

${mockResponses.blogIdeas[Math.floor(Math.random() * mockResponses.blogIdeas.length)]}

Este é um conteúdo de exemplo gerado pelo sistema. Para obter conteúdo personalizado com IA, configure sua chave da OpenAI nas variáveis de ambiente.

## Benefícios da IA para Agências

- Automação de processos repetitivos
- Geração de conteúdo personalizado
- Análise de dados em tempo real
- Otimização de campanhas

Configure a variável OPENAI_API_KEY para ativar a geração de conteúdo com IA real.`
    }
  }

  // Here would be the actual OpenAI integration when API key is available
  try {
    // Placeholder for actual OpenAI call
    // const openai = new OpenAI({ apiKey: config.apiKey })
    // const response = await openai.chat.completions.create({...})
    
    // For now, return enhanced mock response
    return `# Conteúdo Gerado com IA

Baseado no prompt: "${prompt}"

${mockResponses.blogIdeas[Math.floor(Math.random() * mockResponses.blogIdeas.length)]}

[Este conteúdo seria gerado pela OpenAI quando a API key estiver configurada]`
    
  } catch (error) {
    console.error('Erro na geração de conteúdo:', error)
    return mockResponses[type === 'instagram' ? 'instagramCaption' : 'blogIdeas'][0] || 'Erro ao gerar conteúdo'
  }
}

// Usage tracking for AI features
export async function trackAIUsage(agencyId: string, agentType: string, tokensUsed: number = 100, cost: number = 0.001) {
  // This would integrate with the AIUsage table when needed
  console.log(`AI Usage: Agency ${agencyId}, Agent ${agentType}, Tokens: ${tokensUsed}, Cost: $${cost}`)
}