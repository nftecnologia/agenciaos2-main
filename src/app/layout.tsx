import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'AgênciaOS',
  description: 'Plataforma SaaS para agências digitais com IA',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 font-sans antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}