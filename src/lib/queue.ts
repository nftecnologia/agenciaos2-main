// Sistema de queue temporariamente desabilitado para deploy
// Será reabilitado após configuração completa do Redis em produção

export interface EbookJobData {
  ebookId: string
  agencyId: string
  step: 'description' | 'content' | 'pdf'
  approvedDescription?: unknown
}

// Funções placeholder - retornam erro informativo
export async function addEbookJob(jobType: string, data: EbookJobData) {
  throw new Error('Sistema de filas temporariamente indisponível. Configuração do Redis em andamento.')
}

export async function getJobStatus(jobId: string) {
  throw new Error('Sistema de filas temporariamente indisponível. Configuração do Redis em andamento.')
}

// Export placeholder
export const ebookQueue = null
export const ebookWorker = null