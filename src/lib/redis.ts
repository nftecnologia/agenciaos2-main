import Redis from 'ioredis'

// Configuração do Redis - só conecta em runtime, não durante build
let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis && typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    // Só criar conexão Redis em runtime (não durante build)
    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL, {
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true, // Conecta só quando necessário
      })

      redis.on('error', (error) => {
        console.error('Redis connection error:', error)
      })

      redis.on('connect', () => {
        console.log('Redis connected successfully')
      })
    }
  }
  
  if (!redis) {
    throw new Error('Redis not available')
  }
  
  return redis
}

export { getRedis as redis }
export default getRedis