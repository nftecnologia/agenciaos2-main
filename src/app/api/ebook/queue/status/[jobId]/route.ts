import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getJobStatus } from '@/lib/queue'

export async function GET(req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID é obrigatório' }, { status: 400 })
    }

    // Obter status do job
    const jobStatus = await getJobStatus(jobId)

    if (!jobStatus) {
      return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 })
    }

    // Verificar se o job pertence à agência do usuário (se data disponível)
    if (jobStatus.data && jobStatus.data.agencyId !== session.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      job: {
        id: jobStatus.id,
        progress: jobStatus.progress || 0,
        step: jobStatus.data.step,
        ebookId: jobStatus.data.ebookId,
        processedOn: jobStatus.processedOn,
        finishedOn: jobStatus.finishedOn,
        failedReason: jobStatus.failedReason,
        result: jobStatus.returnvalue,
        status: jobStatus.finishedOn 
          ? (jobStatus.failedReason ? 'failed' : 'completed')
          : (jobStatus.processedOn ? 'active' : 'waiting')
      }
    })

  } catch (error) {
    console.error('Erro ao buscar status do job:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}