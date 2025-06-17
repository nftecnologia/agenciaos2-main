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
    const { ebookId } = body

    if (!ebookId) {
      return NextResponse.json({ error: 'ID do ebook é obrigatório' }, { status: 400 })
    }

    // Verificar se o ebook existe e tem conteúdo
    const ebook = await prisma.ebook.findFirst({
      where: {
        id: ebookId,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    if (!ebook.content || !ebook.description) {
      return NextResponse.json({ 
        error: 'Ebook deve ter conteúdo e descrição para gerar PDF' 
      }, { status: 400 })
    }

    // Adicionar job à fila
    const job = await addEbookJob({
      ebookId,
      agencyId: session.user.agencyId,
      title: ebook.title,
      step: 'pdf'
    })

    // Atualizar metadata do ebook
    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        metadata: JSON.stringify({
          ...JSON.parse(ebook.metadata || '{}'),
          jobId: job.id,
          lastJobStep: 'pdf'
        })
      }
    })

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Job de geração de PDF adicionado à fila'
    })

  } catch (error) {
    console.error('Erro ao adicionar job de PDF:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}