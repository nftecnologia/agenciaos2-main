import { NextRequest } from "next/server"
import { appErrors } from "@/lib/errors"

// Rate limiting temporariamente desabilitado para deploy
// Será reabilitado após configuração completa do Redis em produção

// IMPORTANTE: Dependências Redis removidas temporariamente do package.json
// - @upstash/ratelimit  
// - @upstash/redis
// - ioredis
// - bullmq

export const rateLimiters = {
  auth: null,
  api: null,
  dashboard: null,
  ai: null,
}

// Função para obter identificador único do cliente
function getClientIdentifier(request: NextRequest): string {
  // Tentar obter IP real através de headers de proxy
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  
  // Usar o primeiro IP disponível
  const ip = cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown"
  
  return ip.trim()
}

// Função para aplicar rate limiting
export async function applyRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  const rateLimiter = rateLimiters[type]
  
  // Se Redis não estiver configurado, permitir (desenvolvimento)
  if (!rateLimiter) {
    console.warn(`Rate limiting desabilitado para ${type} - Redis não configurado`)
    return { success: true }
  }

  try {
    const identifier = getClientIdentifier(request)
    const { success } = await rateLimiter.limit(identifier)

    if (!success) {
      console.warn(`Rate limit excedido para ${identifier} no endpoint ${type}`)
      return {
        success: false,
        error: appErrors.RATE_LIMIT_EXCEEDED
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao aplicar rate limiting:", error)
    // Em caso de erro, permitir a requisição (fail-open)
    return { success: true }
  }
}

// Middleware para rate limiting em API routes
export function withRateLimit(
  type: keyof typeof rateLimiters = "api"
) {
  return async (request: NextRequest) => {
    const result = await applyRateLimit(request, type)
    
    if (!result.success && result.error) {
      throw result.error
    }
    
    return result
  }
}

// Rate limiting específico por usuário autenticado
export async function applyUserRateLimit(
  userId: string,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  const rateLimiter = rateLimiters[type]
  
  if (!rateLimiter) {
    return { success: true }
  }

  try {
    const identifier = `user:${userId}`
    const { success } = await rateLimiter.limit(identifier)

    if (!success) {
      console.warn(`Rate limit excedido para usuário ${userId} no endpoint ${type}`)
      return {
        success: false,
        error: appErrors.RATE_LIMIT_EXCEEDED
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao aplicar rate limiting por usuário:", error)
    return { success: true }
  }
}

// Rate limiting específico por agência
export async function applyAgencyRateLimit(
  agencyId: string,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  const rateLimiter = rateLimiters[type]
  
  if (!rateLimiter) {
    return { success: true }
  }

  try {
    const identifier = `agency:${agencyId}`
    const { success } = await rateLimiter.limit(identifier)

    if (!success) {
      console.warn(`Rate limit excedido para agência ${agencyId} no endpoint ${type}`)
      return {
        success: false,
        error: appErrors.RATE_LIMIT_EXCEEDED
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao aplicar rate limiting por agência:", error)
    return { success: true }
  }
}

// Função para verificar status do rate limiting
export async function getRateLimitStatus(
  identifier: string,
  type: keyof typeof rateLimiters = "api"
) {
  const rateLimiter = rateLimiters[type]
  
  if (!rateLimiter) {
    return null
  }

  try {
    // Usar limit com 0 para apenas verificar status sem consumir
    const result = await rateLimiter.limit(identifier)
    return {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      success: result.success
    }
  } catch (error) {
    console.error("Erro ao verificar status do rate limiting:", error)
    return null
  }
}

// Configurações de rate limiting por ambiente
export const rateLimitConfig = {
  development: {
    enabled: false, // Desabilitado em desenvolvimento
  },
  production: {
    enabled: true,
    strictMode: true, // Modo mais restritivo em produção
  },
  test: {
    enabled: false, // Desabilitado em testes
  }
}

// Verificar se rate limiting está habilitado - temporariamente desabilitado
export function isRateLimitEnabled(): boolean {
  // Retorna false temporariamente enquanto Redis está desabilitado
  return false
}
