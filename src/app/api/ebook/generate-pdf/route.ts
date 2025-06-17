import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PDFGenerator } from '@/lib/pdf-generator'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { ebookId, template = 'professional' } = body

    if (!ebookId) {
      return NextResponse.json({ error: 'ID do ebook é obrigatório' }, { status: 400 })
    }

    // Buscar ebook com conteúdo
    const ebook = await prisma.ebook.findFirst({
      where: {
        id: ebookId,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook || !ebook.content) {
      return NextResponse.json({ error: 'Ebook ou conteúdo não encontrado' }, { status: 404 })
    }

    // Atualizar status para 'GENERATING_PDF'
    await prisma.ebook.update({
      where: { id: ebookId },
      data: { status: 'GENERATING_PDF' }
    })

    const content = JSON.parse(ebook.content)
    const description = JSON.parse(ebook.description || '{}')

    // Usar o gerador otimizado de PDF
    const pdfBuffer = await PDFGenerator.generateEbookPDF({
      title: ebook.title,
      description,
      content,
      options: {
        template: template === 'modern' ? 'modern' : 'professional',
        primaryColor: '#2563eb',
        font: 'inter'
      }
    })

    // Salvar PDF no sistema de arquivos
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'ebooks')
    await mkdir(uploadsDir, { recursive: true })

    const filename = `ebook-${ebookId}-${Date.now()}.pdf`
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, pdfBuffer)

    const pdfUrl = `/uploads/ebooks/${filename}`

    // Atualizar ebook com URL do PDF
    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        pdfUrl,
        status: 'COMPLETED'
      }
    })

    return NextResponse.json({
      success: true,
      pdfUrl,
      filename,
      size: pdfBuffer.length,
      message: 'PDF gerado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    
    // Em caso de erro, atualizar status
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