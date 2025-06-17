import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

async function checkDatabase() {
  try {
    await db.user.findFirst()
    return true
  } catch {
    console.log('Database not ready, redirecting to setup...')
    return false
  }
}

export default async function DashboardPage() {
  const dbReady = await checkDatabase()
  
  if (!dbReady) {
    redirect('/setup')
  }
  
  return <DashboardOverview />
}
