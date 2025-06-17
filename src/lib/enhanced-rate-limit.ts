import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Configuração do Redis para rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limits diferenciados por plano
export const rateLimits = {
  // Plano FREE
  free: {
    ai: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '30d'), // 20 usos por mês
      analytics: true,
      prefix: 'rate_limit_ai_free',
    }),
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1h'), // 100 requests por hora
      analytics: true,
      prefix: 'rate_limit_api_free',
    }),
  },
  
  // Plano PRO
  pro: {
    ai: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '30d'), // 500 usos por mês
      analytics: true,
      prefix: 'rate_limit_ai_pro',
    }),
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1000, '1h'), // 1000 requests por hora
      analytics: true,
      prefix: 'rate_limit_api_pro',
    }),
  },
  
  // Rate limit geral para prevenir abuso
  global: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1m'), // 50 requests por minuto
    analytics: true,
    prefix: 'rate_limit_global',
  }),
}

// Função para verificar rate limit baseado no plano
export async function checkRateLimit(
  agencyId: string,
  plan: 'FREE' | 'PRO',
  type: 'ai' | 'api'
) {
  const planKey = plan.toLowerCase() as 'free' | 'pro'
  const limiter = rateLimits[planKey][type]
  
  const identifier = `${agencyId}:${plan}:${type}`
  const result = await limiter.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
  }
}

// Rate limit global para prevenir abuso
export async function checkGlobalRateLimit(identifier: string) {
  const result = await rateLimits.global.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
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
  
  // Obter estatísticas usando prefix direto
  const aiIdentifier = `${agencyId}:${plan}:ai`
  const apiIdentifier = `${agencyId}:${plan}:api`
  
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