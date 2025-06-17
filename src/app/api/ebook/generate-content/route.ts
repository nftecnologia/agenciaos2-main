import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { EbookService } from '@/lib/ebook-service'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key não configurada' }, { status: 500 })
    }

    const body = await req.json()
    const { ebookId, approvedDescription } = body

    if (!ebookId || !approvedDescription) {
      return NextResponse.json({ error: 'ID do ebook e descrição aprovada são obrigatórios' }, { status: 400 })
    }

    // Verificar se o ebook existe e pertence ao usuário
    const ebook = await prisma.ebook.findFirst({
      where: {
        id: ebookId,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    // Atualizar status para 'GENERATING'
    await prisma.ebook.update({
      where: { id: ebookId },
      data: { status: 'GENERATING' }
    })

    // Usar o serviço otimizado para gerar conteúdo completo
    const finalContent = await EbookService.generateFullContent({
      title: ebook.title,
      approvedDescription
    })

    // Salvar conteúdo no banco
    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        content: JSON.stringify(finalContent),
        status: 'CONTENT_READY'
      }
    })

    return NextResponse.json({
      success: true,
      data: finalContent,
      message: 'Conteúdo gerado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao gerar conteúdo do ebook:', error)
    
    // Em caso de erro, atualizar status para 'error'
    const body = await req.json().catch(() => ({}))
    if (body.ebookId) {
      await prisma.ebook.update({
        where: { id: body.ebookId },
        data: { status: 'ERROR' }
      }).catch(console.error)
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}