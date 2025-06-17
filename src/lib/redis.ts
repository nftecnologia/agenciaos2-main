import Redis from 'ioredis'

// Configuração do Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

export { redis }
export default redis