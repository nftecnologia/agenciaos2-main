'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'
import { Sidebar } from './sidebar'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Don't show layout for auth pages
  const isAuthPage = pathname?.startsWith('/auth')
  
  if (isAuthPage || !session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
