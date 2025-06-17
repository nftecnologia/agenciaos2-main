import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.agencyId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Temporariamente desabilitado enquanto configuramos Puppeteer em produção
    return NextResponse.json({ 
      error: 'Geração de PDF temporariamente indisponível. Estamos configurando o servidor para suportar esta funcionalidade.' 
    }, { status: 503 })
    
  } catch (error) {
    console.error('Erro na API de PDF:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}