// Variáveis opcionais para não quebrar o build
const optionalServerEnvs = ['MARKUPGO_API_KEY']

export const env = {
  MARKUPGO_API_KEY: process.env.MARKUPGO_API_KEY || 'development-key',
} 