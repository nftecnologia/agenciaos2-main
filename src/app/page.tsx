'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário já está logado
    const userData = localStorage.getItem('user')
    if (userData) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>AgênciaOS</h1>
      <p>Redirecionando...</p>
    </div>
  )
}