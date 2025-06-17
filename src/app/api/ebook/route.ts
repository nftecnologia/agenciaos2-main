import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Listar ebooks
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = {
      agencyId: session.user.agencyId,
      ...(status && { status: status.toUpperCase() as 'DRAFT' | 'DESCRIPTION_GENERATED' | 'DESCRIPTION_APPROVED' | 'GENERATING' | 'CONTENT_READY' | 'GENERATING_PDF' | 'COMPLETED' | 'ERROR' })
    }

    const [ebooks, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          pdfUrl: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.ebook.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: ebooks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar ebooks:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo ebook
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { title, targetAudience, industry } = body

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    const ebook = await prisma.ebook.create({
      data: {
        title: title.trim(),
        agencyId: session.user.agencyId,
        status: 'DRAFT',
        metadata: JSON.stringify({
          targetAudience: targetAudience || null,
          industry: industry || null,
          createdBy: session.user.id
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: ebook,
      message: 'Ebook criado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao criar ebook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}