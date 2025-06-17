// Redis temporariamente desabilitado para deploy
// Será reabilitado após configuração completa em produção

export function getRedis(): never {
  throw new Error('Redis temporariamente indisponível. Configuração em andamento.')
}

export { getRedis as redis }
export default getRedis