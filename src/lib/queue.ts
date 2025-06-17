import { Queue, Worker, Job } from 'bullmq'
import { getRedis } from './redis'

export interface EbookJobData {
  ebookId: string
  agencyId: string
  step: 'description' | 'content' | 'pdf'
  approvedDescription?: unknown
}

// Configuração da conexão Redis para BullMQ
function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL || process.env.REDISCLOUD_URL || process.env.REDIS_PRIVATE_URL
  
  if (redisUrl) {
    // Usar URL do Redis diretamente (Railway/Heroku style)
    return {
      connection: getRedis()
    }
  }
  
  // Fallback para configuração manual
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  }
}

const redisConnection = getRedisConnection()

// Criar fila de ebooks
export const ebookQueue = new Queue('ebook-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
})

// Função para adicionar job na fila
export async function addEbookJob(jobType: string, data: EbookJobData) {
  try {
    const job = await ebookQueue.add(jobType, data, {
      priority: data.step === 'pdf' ? 1 : 10, // PDF tem prioridade mais alta
      delay: 0,
    })

    console.log(`Job ${jobType} adicionado à fila:`, job.id)
    
    return {
      id: job.id,
      status: 'waiting',
      data: job.data
    }
  } catch (error) {
    console.error('Erro ao adicionar job na fila:', error)
    throw new Error('Falha ao adicionar job na fila de processamento')
  }
}

// Função para obter status de um job
export async function getJobStatus(jobId: string) {
  try {
    const job = await Job.fromId(ebookQueue, jobId)
    
    if (!job) {
      return {
        id: jobId,
        status: 'not_found',
        error: 'Job não encontrado',
        data: null,
        progress: 0,
        processedOn: null,
        finishedOn: null,
        failedReason: null,
        returnvalue: null
      }
    }

    const state = await job.getState()
    
    return {
      id: job.id,
      status: state,
      data: job.data,
      progress: job.progress,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue,
      error: job.failedReason
    }
  } catch (error) {
    console.error('Erro ao obter status do job:', error)
    return {
      id: jobId,
      status: 'error',
      error: 'Erro ao verificar status do job',
      data: null,
      progress: 0,
      processedOn: null,
      finishedOn: null,
      failedReason: error instanceof Error ? error.message : 'Erro desconhecido',
      returnvalue: null
    }
  }
}

// Worker será criado em arquivo separado (worker.ts)
export let ebookWorker: Worker | null = null

// Função para inicializar worker (usado apenas no processo worker)
export function createEbookWorker() {
  if (ebookWorker) {
    return ebookWorker
  }

  ebookWorker = new Worker('ebook-generation', async (job: Job) => {
    const { ebookId, agencyId, step, approvedDescription } = job.data as EbookJobData
    
    console.log(`Processando job ${job.id}: ${step} para ebook ${ebookId}`)
    
    // Atualizar progresso
    await job.updateProgress(10)
    
    try {
      switch (step) {
        case 'description':
          // Processar descrição do ebook
          await job.updateProgress(50)
          // Aqui viria a lógica de IA para gerar descrição
          await job.updateProgress(100)
          return { success: true, step: 'description', description: 'Descrição gerada com sucesso' }
          
        case 'content':
          // Processar conteúdo do ebook
          await job.updateProgress(30)
          // Aqui viria a lógica de IA para gerar conteúdo
          await job.updateProgress(80)
          // Simular processamento
          await new Promise(resolve => setTimeout(resolve, 2000))
          await job.updateProgress(100)
          return { success: true, step: 'content', content: 'Conteúdo gerado com sucesso' }
          
        case 'pdf':
          // Gerar PDF do ebook
          await job.updateProgress(20)
          // Aqui viria a lógica do Puppeteer para gerar PDF
          await job.updateProgress(60)
          // Simular geração de PDF
          await new Promise(resolve => setTimeout(resolve, 3000))
          await job.updateProgress(100)
          return { success: true, step: 'pdf', pdfUrl: '/path/to/generated/ebook.pdf' }
          
        default:
          throw new Error(`Step desconhecido: ${step}`)
      }
    } catch (error) {
      console.error(`Erro no processamento do job ${job.id}:`, error)
      throw error
    }
  }, {
    connection: redisConnection,
    concurrency: 3, // Processar até 3 jobs simultaneamente
  })

  ebookWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completado com sucesso`)
  })

  ebookWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} falhou:`, err)
  })

  return ebookWorker
}