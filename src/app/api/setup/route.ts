import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Tentar conectar ao banco e verificar se as tabelas existem
    await db.$connect()
    
    // Executar as migrations se necessário
    await db.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    
    // Verificar se a tabela User existe
    const result = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `
    
    const tableExists = (result as any)[0]?.exists
    
    if (!tableExists) {
      // Executar o push do schema do Prisma
      const { execSync } = await import('child_process')
      execSync('npx prisma db push --force-reset --accept-data-loss', { 
        stdio: 'inherit',
        env: { ...process.env }
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database setup completed successfully',
        tablesCreated: true
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database already configured',
      tablesCreated: false
    })
    
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}