'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<{name?: string, email: string} | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard - AgênciaOS</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Sair
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>Bem-vindo!</h2>
        <p><strong>Nome:</strong> {user.name || 'Usuário'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Funcionalidades disponíveis:</h3>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li>🤖 31 Agentes de IA especializados</li>
            <li>📊 Dashboard de projetos</li>
            <li>💰 Controle financeiro</li>
            <li>📋 Sistema Kanban</li>
            <li>👥 Gestão de clientes</li>
          </ul>
          
          <p style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Em breve:</strong> As funcionalidades completas serão habilitadas gradualmente conforme restauramos os componentes da aplicação.
          </p>
        </div>
      </div>
    </div>
  )
}