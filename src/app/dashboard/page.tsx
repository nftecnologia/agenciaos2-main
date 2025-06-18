'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  clients: {
    total: number
    new: number
    change: number
  }
  projects: {
    total: number
    active: number
    completed: number
    new: number
    change: number
  }
  revenue: {
    total: number
    current: number
    count: number
    change: number
  }
  expenses: {
    total: number
    current: number
    count: number
    change: number
  }
  profit: {
    current: number
    change: number
  }
}

interface AIAgent {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  usage: {
    totalUses: number
    totalTokens: number
    totalCost: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load AI agents
      const agentsResponse = await fetch('/api/ai/agents')
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()
        setAgents(agentsData.agents || [])
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const testAPIEndpoint = async (endpoint: string, method = 'GET') => {
    try {
      const response = await fetch(endpoint, { method })
      const data = await response.json()
      alert(`✅ ${endpoint} funcionando!\n\nStatus: ${response.status}\nResposta: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      alert(`❌ Erro em ${endpoint}:\n${error}`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AgênciaOS Dashboard</h1>
              <p className="text-gray-600">Bem-vindo, {session.user?.name || session.user?.email}</p>
            </div>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.clients.total}</p>
                  <p className="text-sm text-green-600">+{stats.clients.new} novos</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projetos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.projects.total}</p>
                  <p className="text-sm text-blue-600">{stats.projects.active} ativos</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.revenue.current.toLocaleString('pt-BR')}
                  </p>
                  <p className={`text-sm ${stats.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.revenue.change >= 0 ? '+' : ''}{stats.revenue.change}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">📈</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lucro Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.profit.current.toLocaleString('pt-BR')}
                  </p>
                  <p className={`text-sm ${stats.profit.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.profit.change >= 0 ? '+' : ''}{stats.profit.change}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button
              onClick={() => testAPIEndpoint('/api/clients')}
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm font-medium text-gray-700">Clientes</span>
            </button>

            <button
              onClick={() => testAPIEndpoint('/api/projects')}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-700">Projetos</span>
            </button>

            <button
              onClick={() => testAPIEndpoint('/api/revenues')}
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mb-2">💰</span>
              <span className="text-sm font-medium text-gray-700">Receitas</span>
            </button>

            <button
              onClick={() => testAPIEndpoint('/api/expenses')}
              className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <span className="text-2xl mb-2">💸</span>
              <span className="text-sm font-medium text-gray-700">Despesas</span>
            </button>

            <button
              onClick={() => testAPIEndpoint('/api/boards')}
              className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm font-medium text-gray-700">Kanban</span>
            </button>

            <button
              onClick={() => testAPIEndpoint('/api/triggers')}
              className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl mb-2">⚙️</span>
              <span className="text-sm font-medium text-gray-700">Triggers</span>
            </button>
          </div>
        </div>

        {/* AI Agents */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agentes de IA Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => testAPIEndpoint(`/api/ai/${agent.id.replace('_', '/')}`)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{agent.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{agent.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Usos: {agent.usage.totalUses}</p>
                  <p>Tokens: {agent.usage.totalTokens.toLocaleString()}</p>
                  <p>Custo: R$ {agent.usage.totalCost.toFixed(4)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test All APIs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teste de APIs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '/api/ai/blog',
              '/api/ai/instagram', 
              '/api/ai/whatsapp',
              '/api/ai/seo',
              '/api/ai/funnel',
              '/api/ai/youtube',
              '/api/ai/ads',
              '/api/ai/copywriting',
              '/api/ai/analytics',
              '/api/ai/audience',
              '/api/ai/automation',
              '/api/financial/stats'
            ].map((endpoint) => (
              <button
                key={endpoint}
                onClick={() => testAPIEndpoint(endpoint)}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-mono text-blue-600">{endpoint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}