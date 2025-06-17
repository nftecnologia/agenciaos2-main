// Sistema de queue temporariamente desabilitado para deploy
// Será reabilitado após configuração completa do Redis em produção

// IMPORTANTE: Dependência bullmq removida temporariamente do package.json

export interface EbookJobData {
  ebookId: string
  agencyId: string
  step: 'description' | 'content' | 'pdf'
  approvedDescription?: unknown
}

// Funções placeholder - retornam erro informativo
export async function addEbookJob(_jobType: string, _data: EbookJobData) {
  // Retorna um job fake para não quebrar o código durante deploy
  return {
    id: `temp-job-${Date.now()}`,
    status: 'failed',
    data: _data
  }
}

export async function getJobStatus(_jobId: string) {
  // Retorna status fake para não quebrar o código durante deploy
  return {
    id: _jobId,
    status: 'failed',
    error: 'Sistema de filas temporariamente indisponível. Configuração do Redis em andamento.',
    data: { 
      agencyId: 'temp',
      step: 'description' as const,
      ebookId: 'temp'
    },
    progress: 0,
    processedOn: null,
    finishedOn: null,
    failedReason: 'Sistema de filas temporariamente indisponível',
    returnvalue: null
  }
}

// Export placeholder
export const ebookQueue = null
export const ebookWorker = null