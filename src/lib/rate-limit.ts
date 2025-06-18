import { NextRequest } from 'next/server'

// Rate limiting simples sem Redis para desenvolvimento
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function applyRateLimit(
  request: NextRequest,
  type: 'api' | 'auth' | 'dashboard' = 'api'
): Promise<{ success: boolean; error?: Error }> {
  try {
    // Configurações de rate limit por tipo
    const limits = {
      api: { requests: 100, windowMs: 60 * 1000 }, // 100 requests por minuto
      auth: { requests: 10, windowMs: 60 * 1000 }, // 10 requests por minuto
      dashboard: { requests: 50, windowMs: 60 * 1000 }, // 50 requests por minuto
    }

    const { requests, windowMs } = limits[type]

    // Usar IP como identificador
    const identifier = request.ip || 'unknown'
    const key = `${type}:${identifier}`
    
    const now = Date.now()
    const record = rateLimitMap.get(key)

    if (!record) {
      // Primeira requisição
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return { success: true }
    }

    if (now > record.resetTime) {
      // Janela expirou, resetar
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return { success: true }
    }

    if (record.count >= requests) {
      // Limite excedido
      return {
        success: false,
        error: new Error(`Muitas requisições. Tente novamente em ${Math.ceil((record.resetTime - now) / 1000)} segundos.`),
      }
    }

    // Incrementar contador
    record.count++
    rateLimitMap.set(key, record)

    return { success: true }
  } catch (error) {
    // Em caso de erro, permitir a requisição
    console.error('Erro no rate limiting:', error)
    return { success: true }
  }
}

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60 * 1000) // Limpar a cada minuto