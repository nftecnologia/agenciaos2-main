import { NextRequest } from "next/server"

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

// Função desabilitada temporariamente
// function getClientIdentifier(request: NextRequest): string {
//   const forwarded = request.headers.get("x-forwarded-for")
//   const realIp = request.headers.get("x-real-ip")
//   const cfConnectingIp = request.headers.get("cf-connecting-ip")
//   const ip = cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown"
//   return ip.trim()
// }

// Função para aplicar rate limiting - temporariamente desabilitada
export async function applyRateLimit(
  _request: NextRequest,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  // Rate limiting temporariamente desabilitado para deploy
  console.warn(`Rate limiting desabilitado para ${type} - Redis não configurado`)
  return { success: true }
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

// Rate limiting específico por usuário autenticado - temporariamente desabilitado
export async function applyUserRateLimit(
  _userId: string,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  // Rate limiting temporariamente desabilitado para deploy
  console.warn(`Rate limiting desabilitado para usuário no endpoint ${type}`)
  return { success: true }
}

// Rate limiting específico por agência - temporariamente desabilitado
export async function applyAgencyRateLimit(
  _agencyId: string,
  type: keyof typeof rateLimiters = "api"
): Promise<{ success: boolean; error?: Error }> {
  // Rate limiting temporariamente desabilitado para deploy
  console.warn(`Rate limiting desabilitado para agência no endpoint ${type}`)
  return { success: true }
}

// Função para verificar status do rate limiting - temporariamente desabilitada
export async function getRateLimitStatus(
  _identifier: string,
  type: keyof typeof rateLimiters = "api"
) {
  // Rate limiting temporariamente desabilitado para deploy
  console.warn(`Rate limiting status desabilitado para ${type}`)
  return null
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
