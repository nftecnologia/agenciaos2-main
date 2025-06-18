const requiredServerEnvs = ['MARKUPGO_API_KEY']

for (const env of requiredServerEnvs) {
  if (!process.env[env]) {
    throw new Error(`❌ Variável de ambiente ${env} não encontrada`)
  }
}

export const env = {
  MARKUPGO_API_KEY: process.env.MARKUPGO_API_KEY,
} 