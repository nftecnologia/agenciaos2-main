import Redis from 'ioredis'

let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || process.env.REDIS_PRIVATE_URL

    if (!redisUrl) {
      throw new Error('REDIS_URL não configurado. Configure a variável de ambiente REDIS_URL.')
    }

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      // Configurações para Railway Redis
      family: 4,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    })

    redis.on('error', (error) => {
      console.error('Redis connection error:', error)
    })

    redis.on('connect', () => {
      console.log('Redis connected successfully')
    })
  }

  return redis
}

export { getRedis as redis }
export default getRedis