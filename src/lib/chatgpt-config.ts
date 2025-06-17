// Configurações otimizadas para compatibilidade máxima com ChatGPT oficial
export const CHATGPT_CONFIG = {
  // Modelos disponíveis (atualizados para 2025)
  MODELS: {
    'gpt-4o': {
      name: 'GPT-4o',
      description: 'Modelo mais avançado com capacidades multimodais',
      maxTokens: 128000,
      contextWindow: 128000,
      isLatest: true
    },
    'gpt-4o-mini': {
      name: 'GPT-4o Mini', 
      description: 'Versão otimizada do GPT-4o',
      maxTokens: 128000,
      contextWindow: 128000,
      isRecommended: true
    },
    'chatgpt-4o-latest': {
      name: 'ChatGPT-4o Latest',
      description: 'Idêntico à interface web do ChatGPT',
      maxTokens: 128000,
      contextWindow: 128000,
      isWebVersion: true
    },
    'gpt-4-turbo': {
      name: 'GPT-4 Turbo',
      description: 'GPT-4 mais rápido com contexto estendido',
      maxTokens: 128000,
      contextWindow: 128000
    },
    'gpt-4': {
      name: 'GPT-4',
      description: 'Modelo avançado para tarefas complexas',
      maxTokens: 8192,
      contextWindow: 8192
    },
    'gpt-3.5-turbo': {
      name: 'GPT-3.5 Turbo',
      description: 'Rápido e eficiente para tarefas gerais',
      maxTokens: 16385,
      contextWindow: 16385
    }
  } as const,

  // Configurações de API por modelo (idênticas ao ChatGPT web)
  API_CONFIGS: {
    'gpt-4o': {
      temperature: 1,
      top_p: 1,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    },
    'gpt-4o-mini': {
      temperature: 1,
      top_p: 1,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    },
    'chatgpt-4o-latest': {
      temperature: 1,
      top_p: 1,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    },
    'gpt-4-turbo': {
      temperature: 1,
      top_p: 1,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    },
    'gpt-4': {
      temperature: 1,
      top_p: 1,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    },
    'gpt-3.5-turbo': {
      temperature: 1,
      top_p: 1,
      max_tokens: 1024,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    }
  } as const,

  // System prompts por tipo de conversa
  SYSTEM_PROMPTS: {
    default: 'You are ChatGPT, a large language model trained by OpenAI. Answer as helpfully as possible while being safe. Your knowledge cutoff is April 2024.',
    portuguese: 'You are ChatGPT, a large language model trained by OpenAI. Always respond in Brazilian Portuguese. Answer as helpfully as possible while being safe. Your knowledge cutoff is April 2024.',
    creative: 'You are ChatGPT, a large language model trained by OpenAI. Be creative and engaging in your responses while maintaining accuracy. Your knowledge cutoff is April 2024.',
    analytical: 'You are ChatGPT, a large language model trained by OpenAI. Provide detailed, analytical responses with clear reasoning. Your knowledge cutoff is April 2024.'
  } as const,

  // Configurações de interface
  UI_CONFIG: {
    defaultModel: 'gpt-4o',
    showTokenCount: true,
    showModelBadges: true,
    enableExport: true,
    enableClear: true,
    maxMessagesHistory: 50
  }
}

// Helper para obter configuração do modelo
export function getModelConfig(modelId: string) {
  return CHATGPT_CONFIG.API_CONFIGS[modelId as keyof typeof CHATGPT_CONFIG.API_CONFIGS] || 
         CHATGPT_CONFIG.API_CONFIGS['gpt-4o']
}

// Helper para obter informações do modelo
export function getModelInfo(modelId: string) {
  return CHATGPT_CONFIG.MODELS[modelId as keyof typeof CHATGPT_CONFIG.MODELS] ||
         CHATGPT_CONFIG.MODELS['gpt-4o']
}

// Validar se o modelo está disponível
export function isValidModel(modelId: string): boolean {
  return modelId in CHATGPT_CONFIG.MODELS
}

// Obter lista de modelos ordenada por prioridade
export function getOrderedModels() {
  return Object.entries(CHATGPT_CONFIG.MODELS)
    .sort(([,a], [,b]) => {
      if ('isLatest' in a && a.isLatest) return -1
      if ('isLatest' in b && b.isLatest) return 1
      if ('isRecommended' in a && a.isRecommended) return -1
      if ('isRecommended' in b && b.isRecommended) return 1
      if ('isWebVersion' in a && a.isWebVersion) return -1
      if ('isWebVersion' in b && b.isWebVersion) return 1
      return 0
    })
    .map(([id, info]) => ({ id, ...info }))
}