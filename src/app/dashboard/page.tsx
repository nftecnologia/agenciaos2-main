'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  Kanban, 
  FileText, 
  Settings,
  LogOut,
  Bell,
  Search,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
    toast.success('Logout realizado com sucesso!')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const stats = [
    {
      title: "Projetos Ativos",
      value: "12",
      icon: Kanban,
      change: "+2.5%",
      changeType: "positive" as const
    },
    {
      title: "Clientes",
      value: "48",
      icon: Users,
      change: "+12.5%",
      changeType: "positive" as const
    },
    {
      title: "Receita Mensal",
      value: "R$ 24.8k",
      icon: DollarSign,
      change: "+8.2%",
      changeType: "positive" as const
    },
    {
      title: "Tarefas Concluídas",
      value: "89%",
      icon: TrendingUp,
      change: "+3.1%",
      changeType: "positive" as const
    }
  ]

  const aiAgents = [
    { name: "Blog Writer", description: "Criação de conteúdo para blogs", status: "Ativo" },
    { name: "Instagram Manager", description: "Gestão de posts e stories", status: "Ativo" },
    { name: "WhatsApp Assistant", description: "Automação de mensagens", status: "Ativo" },
    { name: "Funnel Creator", description: "Criação de funis de vendas", status: "Ativo" },
    { name: "SEO Optimizer", description: "Otimização para buscadores", status: "Ativo" },
    { name: "YouTube Content", description: "Scripts e descrições", status: "Ativo" }
  ]

  const recentProjects = [
    { name: "E-commerce Beleza", client: "Beauty Store", status: "Em andamento", progress: 75 },
    { name: "App Delivery", client: "Food Express", status: "Concluído", progress: 100 },
    { name: "Site Corporativo", client: "TechCorp", status: "Em andamento", progress: 45 },
    { name: "Campanha Digital", client: "Fashion Brand", status: "Planejamento", progress: 25 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AgênciaOS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Olá, {session.user.name || 'Usuário'}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades e métricas principais.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Agentes de IA
              </CardTitle>
              <CardDescription>
                31 agentes especializados para automatizar suas tarefas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiAgents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {agent.status}
                    </Badge>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ver Todos os Agentes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Projetos Recentes
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso dos seus projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <Badge 
                        variant={project.status === 'Concluído' ? 'default' : 'secondary'}
                        className={
                          project.status === 'Concluído' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Cliente: {project.client}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.progress}% concluído</p>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-24 flex-col" variant="outline">
                <Bot className="h-8 w-8 mb-2" />
                Usar IA
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <Users className="h-8 w-8 mb-2" />
                Clientes
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <Kanban className="h-8 w-8 mb-2" />
                Kanban
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <BarChart3 className="h-8 w-8 mb-2" />
                Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}