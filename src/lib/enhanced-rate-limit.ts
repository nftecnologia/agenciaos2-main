// Rate limiting temporariamente desabilitado para deploy
// Será reabilitado após configuração completa do Redis em produção

// IMPORTANTE: Dependências Redis removidas temporariamente do package.json
// - @upstash/ratelimit
// - @upstash/redis
// - ioredis
// - bullmq

// Rate limits temporariamente desabilitados - placeholder para deploy
export const rateLimits = {
  free: { ai: null, api: null },
  pro: { ai: null, api: null },
  global: null,
}

// Função para verificar rate limit baseado no plano - temporariamente desabilitada
export async function checkRateLimit(
  agencyId: string,
  plan: 'FREE' | 'PRO',
  type: 'ai' | 'api'
) {
  // Retorna sucesso temporariamente para permitir deploy
  return {
    success: true,
    limit: plan === 'FREE' ? (type === 'ai' ? 20 : 100) : (type === 'ai' ? 500 : 1000),
    remaining: plan === 'FREE' ? (type === 'ai' ? 20 : 100) : (type === 'ai' ? 500 : 1000),
    reset: new Date(Date.now() + 60 * 60 * 1000),
  }
}

// Rate limit global para prevenir abuso - temporariamente desabilitado
export async function checkGlobalRateLimit(identifier: string) {
  // Retorna sucesso temporariamente para permitir deploy
  return {
    success: true,
    limit: 50,
    remaining: 50,
    reset: new Date(Date.now() + 60 * 1000),
  }
}

// Middleware para aplicar rate limiting nas APIs
export function createRateLimitMiddleware(type: 'ai' | 'api') {
  return async function rateLimitMiddleware(
    agencyId: string,
    plan: 'FREE' | 'PRO',
    ip: string
  ) {
    // Verificar rate limit global primeiro
    const globalCheck = await checkGlobalRateLimit(ip)
    if (!globalCheck.success) {
      return {
        error: 'Rate limit excedido. Tente novamente em alguns minutos.',
        status: 429,
        headers: {
          'X-RateLimit-Limit': globalCheck.limit.toString(),
          'X-RateLimit-Remaining': globalCheck.remaining.toString(),
          'X-RateLimit-Reset': globalCheck.reset.toISOString(),
        },
      }
    }
    
    // Verificar rate limit do plano
    const planCheck = await checkRateLimit(agencyId, plan, type)
    if (!planCheck.success) {
      const planName = plan === 'FREE' ? 'Gratuito' : 'Pro'
      const limitType = type === 'ai' ? 'gerações de IA' : 'requests de API'
      
      return {
        error: `Limite do plano ${planName} excedido para ${limitType}. Upgrade seu plano ou aguarde o reset.`,
        status: 429,
        headers: {
          'X-RateLimit-Limit': planCheck.limit.toString(),
          'X-RateLimit-Remaining': planCheck.remaining.toString(),
          'X-RateLimit-Reset': planCheck.reset.toISOString(),
        },
      }
    }
    
    return {
      success: true,
      headers: {
        'X-RateLimit-Limit': planCheck.limit.toString(),
        'X-RateLimit-Remaining': planCheck.remaining.toString(),
        'X-RateLimit-Reset': planCheck.reset.toISOString(),
      },
    }
  }
}

// Função para obter estatísticas de uso  
export async function getRateLimitStats(agencyId: string, plan: 'FREE' | 'PRO') {
  const planKey = plan.toLowerCase() as 'free' | 'pro'
  
  // Simular limites baseados no plano
  const limits = {
    free: { ai: 20, api: 100 },
    pro: { ai: 500, api: 1000 }
  }
  
  const planLimits = limits[planKey]
  
  return {
    ai: {
      limit: planLimits.ai,
      remaining: planLimits.ai, // Seria obtido do Redis em implementação real
      used: 0, // Seria calculado do Redis em implementação real  
      reset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
    api: {
      limit: planLimits.api,
      remaining: planLimits.api, // Seria obtido do Redis em implementação real
      used: 0, // Seria calculado do Redis em implementação real
      reset: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  }
}