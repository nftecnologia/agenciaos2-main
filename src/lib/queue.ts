import { Queue, Worker, Job } from 'bullmq'
import { redis } from './redis'
import { EbookService } from './ebook-service'
import { PDFGenerator } from './pdf-generator'
import { prisma } from './db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Tipos para os jobs
export interface EbookJobData {
  ebookId: string
  agencyId: string
  title: string
  targetAudience?: string
  industry?: string
  step: 'description' | 'content' | 'pdf'
  approvedDescription?: unknown
}

// Configuração da queue
export const ebookQueue = new Queue('ebook-generation', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

// Worker para processar jobs de ebook
export const ebookWorker = new Worker(
  'ebook-generation',
  async (job: Job<EbookJobData>) => {
    const { ebookId, step } = job.data

    try {
      console.log(`Processando job ${job.id}: ${step} para ebook ${ebookId}`)

      switch (step) {
        case 'description':
          return await processDescriptionGeneration(job)
        case 'content':
          return await processContentGeneration(job)
        case 'pdf':
          return await processPDFGeneration(job)
        default:
          throw new Error(`Step não reconhecido: ${step}`)
      }
    } catch (error) {
      console.error(`Erro no job ${job.id}:`, error)
      
      // Atualizar status do ebook para ERROR
      await prisma.ebook.update({
        where: { id: ebookId },
        data: { status: 'ERROR' }
      }).catch(console.error)
      
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 2, // Processar até 2 jobs simultaneamente
  }
)

// Processar geração de descrição
async function processDescriptionGeneration(job: Job<EbookJobData>) {
  const { ebookId } = job.data

  // Buscar ebook para obter dados atualizados
  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId }
  })

  if (!ebook) {
    throw new Error('Ebook não encontrado')
  }

  const metadata = JSON.parse(ebook.metadata || '{}')
  const { title, targetAudience, industry } = { 
    title: ebook.title,
    targetAudience: metadata.targetAudience,
    industry: metadata.industry
  }

  // Atualizar progresso
  await job.updateProgress(10)

  // Gerar descrição
  const description = await EbookService.generateDescription({
    title,
    targetAudience,
    industry
  })

  await job.updateProgress(90)

  // Salvar no banco
  await prisma.ebook.update({
    where: { id: ebookId },
    data: {
      description: JSON.stringify(description),
      status: 'DESCRIPTION_GENERATED'
    }
  })

  await job.updateProgress(100)

  return {
    success: true,
    description,
    message: 'Descrição gerada com sucesso'
  }
}

// Processar geração de conteúdo
async function processContentGeneration(job: Job<EbookJobData>) {
  const { ebookId } = job.data

  // Buscar ebook para obter dados atualizados
  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId }
  })

  if (!ebook?.description) {
    throw new Error('Ebook deve ter descrição para gerar conteúdo')
  }

  const approvedDescription = JSON.parse(ebook.description)

  // Atualizar status
  await prisma.ebook.update({
    where: { id: ebookId },
    data: { status: 'GENERATING' }
  })

  await job.updateProgress(5)

  // Gerar conteúdo completo
  const content = await EbookService.generateFullContent({
    title: ebook.title,
    approvedDescription
  })

  await job.updateProgress(90)

  // Salvar no banco
  await prisma.ebook.update({
    where: { id: ebookId },
    data: {
      content: JSON.stringify(content),
      status: 'CONTENT_READY'
    }
  })

  await job.updateProgress(100)

  return {
    success: true,
    content,
    message: 'Conteúdo gerado com sucesso'
  }
}

// Processar geração de PDF
async function processPDFGeneration(job: Job<EbookJobData>) {
  const { ebookId } = job.data

  // Buscar ebook atualizado
  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId }
  })

  if (!ebook?.content || !ebook?.description) {
    throw new Error('Ebook deve ter conteúdo e descrição para gerar PDF')
  }

  // Atualizar status
  await prisma.ebook.update({
    where: { id: ebookId },
    data: { status: 'GENERATING_PDF' }
  })

  await job.updateProgress(10)

  const description = JSON.parse(ebook.description)
  const content = JSON.parse(ebook.content)

  // Gerar PDF
  const pdfBuffer = await PDFGenerator.generateEbookPDF({
    title: ebook.title,
    description,
    content,
    options: {
      template: 'professional',
      primaryColor: '#2563eb',
      font: 'inter'
    }
  })

  await job.updateProgress(70)

  // Salvar PDF
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'ebooks')
  await mkdir(uploadsDir, { recursive: true })

  const fileName = `${ebookId}-${Date.now()}.pdf`
  const filePath = join(uploadsDir, fileName)
  const publicUrl = `/uploads/ebooks/${fileName}`

  await writeFile(filePath, pdfBuffer)

  await job.updateProgress(90)

  // Atualizar ebook
  await prisma.ebook.update({
    where: { id: ebookId },
    data: {
      pdfUrl: publicUrl,
      status: 'COMPLETED'
    }
  })

  await job.updateProgress(100)

  return {
    success: true,
    pdfUrl: publicUrl,
    message: 'PDF gerado com sucesso'
  }
}

// Event listeners para monitoramento
ebookWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completado com sucesso`)
})

ebookWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} falhou:`, err)
})

ebookWorker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progresso: ${progress}%`)
})

// Função helper para adicionar jobs
export async function addEbookJob(data: EbookJobData) {
  const job = await ebookQueue.add(`ebook-${data.step}`, data, {
    priority: data.step === 'description' ? 1 : data.step === 'content' ? 2 : 3,
    delay: 0,
  })

  console.log(`Job ${job.id} adicionado à fila: ${data.step} para ebook ${data.ebookId}`)
  return job
}

// Função para obter status de um job
export async function getJobStatus(jobId: string) {
  const job = await Job.fromId(ebookQueue, jobId)
  if (!job) return null

  return {
    id: job.id,
    progress: job.progress,
    data: job.data,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    failedReason: job.failedReason,
    returnvalue: job.returnvalue,
  }
}

export default ebookQueue