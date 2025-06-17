import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { addEbookJob } from '@/lib/queue'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { ebookId, approvedDescription } = body

    if (!ebookId || !approvedDescription) {
      return NextResponse.json({ 
        error: 'ID do ebook e descrição aprovada são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se o ebook existe e pertence à agência
    const ebook = await prisma.ebook.findFirst({
      where: {
        id: ebookId,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    // Adicionar job à fila
    const job = await addEbookJob('content', {
      ebookId,
      agencyId: session.user.agencyId,
      step: 'content',
      approvedDescription
    })

    // Atualizar ebook com descrição aprovada
    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        description: JSON.stringify(approvedDescription),
        status: 'DESCRIPTION_APPROVED',
        metadata: JSON.stringify({
          ...JSON.parse(ebook.metadata || '{}'),
          jobId: job.id,
          lastJobStep: 'content'
        })
      }
    })

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Job de geração de conteúdo adicionado à fila'
    })

  } catch (error) {
    console.error('Erro ao adicionar job de conteúdo:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}