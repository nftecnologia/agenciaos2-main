import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Buscar ebook específico
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: ebook
    })

  } catch (error) {
    console.error('Erro ao buscar ebook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar ebook
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, content, status } = body

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    const updatedEbook = await prisma.ebook.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: JSON.stringify(description) }),
        ...(content && { content: JSON.stringify(content) }),
        ...(status && { status }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedEbook,
      message: 'Ebook atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar ebook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar ebook
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        agencyId: session.user.agencyId
      }
    })

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 })
    }

    await prisma.ebook.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Ebook deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar ebook:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}