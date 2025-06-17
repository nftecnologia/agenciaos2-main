import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Debug API - Iniciando busca de clientes...')
    
    const session = await auth()
    console.log('📋 Sessão:', {
      hasSession: !!session,
      userId: session?.user?.id,
      agencyId: session?.user?.agencyId,
      role: session?.user?.role
    })
    
    if (!session?.user?.id) {
      console.log('❌ Usuário não autenticado')
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (!session.user.agencyId) {
      console.log('❌ Usuário sem agencyId')
      return NextResponse.json({ error: 'Usuário não vinculado a uma agência' }, { status: 400 })
    }

    // Buscar dados do usuário
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        agency: true,
        ownedAgency: true
      }
    })

    console.log('👤 Dados do usuário:', {
      id: user?.id,
      email: user?.email,
      agencyId: user?.agencyId,
      hasAgency: !!user?.agency,
      hasOwnedAgency: !!user?.ownedAgency
    })

    // Buscar todos os clientes da agência
    const clients = await db.client.findMany({
      where: {
        agencyId: session.user.agencyId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('👥 Clientes encontrados:', clients.length)
    console.log('📊 Lista de clientes:', clients.map(c => ({ id: c.id, name: c.name, agencyId: c.agencyId })))

    // Buscar todas as agências para debug
    const allAgencies = await db.agency.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            clients: true
          }
        }
      }
    })

    console.log('🏢 Todas as agências:', allAgencies)

    return NextResponse.json({
      debug: {
        session: {
          userId: session.user.id,
          agencyId: session.user.agencyId,
          role: session.user.role
        },
        user: {
          id: user?.id,
          email: user?.email,
          agencyId: user?.agencyId,
          hasAgency: !!user?.agency,
          hasOwnedAgency: !!user?.ownedAgency
        },
        allAgencies,
        clientsForThisAgency: clients.length
      },
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        agencyId: client.agencyId,
        createdAt: client.createdAt
      }))
    })
  } catch (error) {
    console.error('💥 Erro na API de debug:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro interno',
      debug: {
        errorType: error?.constructor?.name,
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}