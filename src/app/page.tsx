import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

async function checkDatabaseSetup() {
  try {
    // Verificar se a tabela users existe
    const result = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `
    return (result as any)[0]?.exists === true
  } catch {
    return false
  }
}

export default async function DashboardPage() {
  const session = await auth()
  
  // Se não está autenticado, redirecionar para login
  if (!session) {
    redirect('/auth/signin')
  }
  
  // Verificar se o banco precisa ser configurado apenas se não há sessão ativa
  // Se o usuário está logado, significa que o banco já está funcionando
  const dbReady = await checkDatabaseSetup()
  
  if (!dbReady) {
    redirect('/setup')
  }
  
  return <DashboardOverview />
}
