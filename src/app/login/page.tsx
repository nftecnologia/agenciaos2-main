'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulação de login - em produção conectaria com API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email && password) {
      // Simular login bem-sucedido
      localStorage.setItem('user', JSON.stringify({ email }))
      router.push('/dashboard')
    } else {
      alert('Por favor, preencha todos os campos')
    }
    
    setLoading(false)
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>AgênciaOS - Login</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Entrar</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: loading ? '#ccc' : '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          <a href="/signup" style={{ color: '#0070f3' }}>Criar conta</a>
        </p>
      </div>
    </div>
  )
}