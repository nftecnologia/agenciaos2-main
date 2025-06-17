import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// API simplificada para testar busca de clientes
export async function GET() {
  try {
    console.log('🧪 Testando busca de clientes...')
    
    const session = await auth()
    
    if (!session?.user?.agencyId) {
      return NextResponse.json({ 
        error: 'Usuário não autenticado ou sem agência',
        session: {
          hasSession: !!session,
          hasUser: !!session?.user,
          hasAgencyId: !!session?.user?.agencyId
        }
      }, { status: 401 })
    }

    console.log('✅ Sessão válida:', {
      userId: session.user.id,
      agencyId: session.user.agencyId
    })

    // Buscar clientes sem validação de parâmetros
    const clients = await db.client.findMany({
      where: {
        agencyId: session.user.agencyId
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        agencyId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📊 Clientes encontrados:', clients.length)

    return NextResponse.json({
      success: true,
      count: clients.length,
      agencyId: session.user.agencyId,
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company
      }))
    })
  } catch (error) {
    console.error('❌ Erro na API de teste:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro interno',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// API para criar cliente de teste
export async function POST() {
  try {
    console.log('🧪 Criando cliente de teste...')
    
    const session = await auth()
    
    if (!session?.user?.agencyId) {
      return NextResponse.json({ 
        error: 'Usuário não autenticado ou sem agência' 
      }, { status: 401 })
    }

    const testClient = await db.client.create({
      data: {
        name: `Cliente Teste ${Date.now()}`,
        email: `teste${Date.now()}@exemplo.com`,
        company: 'Empresa Teste',
        agencyId: session.user.agencyId
      }
    })

    console.log('✅ Cliente de teste criado:', testClient.id)

    return NextResponse.json({
      success: true,
      message: 'Cliente de teste criado',
      client: {
        id: testClient.id,
        name: testClient.name,
        email: testClient.email,
        company: testClient.company
      }
    })
  } catch (error) {
    console.error('❌ Erro ao criar cliente de teste:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro interno'
    }, { status: 500 })
  }
}