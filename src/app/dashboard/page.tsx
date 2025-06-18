'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router, mounted])

  if (!mounted || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!mounted ? 'Inicializando...' : 'Verificando autenticação...'}
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <DashboardOverview period={period} onPeriodChange={setPeriod} />
}