'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulação de cadastro - em produção conectaria com API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password) {
      // Simular cadastro bem-sucedido
      localStorage.setItem('user', JSON.stringify({ name, email }))
      router.push('/dashboard')
    } else {
      alert('Por favor, preencha todos os campos')
    }
    
    setLoading(false)
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>AgênciaOS - Cadastro</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Criar Conta</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Nome completo" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
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
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          <a href="/login" style={{ color: '#0070f3' }}>Já tem conta? Entrar</a>
        </p>
      </div>
    </div>
  )
}