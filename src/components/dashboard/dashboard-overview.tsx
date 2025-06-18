'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard, StatsGrid } from './stats-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  MessageSquare,
  Calendar,
  Target,
  BarChart3,
  Activity,
  CreditCard
} from 'lucide-react'

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
  tasks?: {
    total: number
    completed: number
    inProgress: number
    completionRate: number
  }
  summary?: {
    totalClients: number
    activeProjects: number
    monthlyRevenue: number
    monthlyProfit: number
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

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "1y", label: "Último ano" },
]

interface DashboardOverviewProps {
  period?: string
  onPeriodChange?: (period: string) => void
}

export function DashboardOverview({ period = '30d', onPeriodChange }: DashboardOverviewProps) {
  const [currentPeriod, setPeriod] = useState(period)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [currentPeriod])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load dashboard stats
      try {
        const statsResponse = await fetch(`/api/dashboard/stats?period=${currentPeriod}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (statsError) {
        console.warn('Error loading stats:', statsError)
        setStats({
          clients: { total: 0, new: 0, change: 0 },
          projects: { total: 0, active: 0, completed: 0, new: 0, change: 0 },
          revenue: { total: 0, current: 0, count: 0, change: 0 },
          expenses: { total: 0, current: 0, count: 0, change: 0 },
          profit: { current: 0, change: 0 },
          tasks: { total: 0, completed: 0, inProgress: 0, completionRate: 0 },
          summary: { totalClients: 0, activeProjects: 0, monthlyRevenue: 0, monthlyProfit: 0 }
        })
      }

      // Load AI agents
      try {
        const agentsResponse = await fetch('/api/ai/agents')
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json()
          setAgents(Array.isArray(agentsData.agents) ? agentsData.agents.slice(0, 6) : [])
        }
      } catch (agentsError) {
        console.warn('Error loading agents:', agentsError)
        setAgents([])
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    onPeriodChange?.(newPeriod)
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Erro ao carregar estatísticas do dashboard</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </Card>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <StatsGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </StatsGrid>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentPeriodLabel = periodOptions.find(p => p.value === period)?.label || "Período atual"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas da sua agência
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total de Clientes"
          value={stats.clients.total}
          change={stats.clients.change}
          icon={Users}
          description={`${stats.clients.new} novos no período`}
          format="number"
        />
        
        <StatsCard
          title="Projetos Ativos"
          value={stats.projects.active}
          change={stats.projects.change}
          icon={FolderOpen}
          description={`${stats.projects.completed} concluídos`}
          format="number"
        />
        
        <StatsCard
          title="Receita"
          value={stats.revenue.current}
          change={stats.revenue.change}
          icon={DollarSign}
          description={currentPeriodLabel}
          format="currency"
        />
        
        <StatsCard
          title="Lucro"
          value={stats.profit.current}
          change={stats.profit.change}
          icon={stats.profit.current >= 0 ? TrendingUp : TrendingDown}
          description={`Margem: ${stats.revenue.current > 0 ? Math.round((stats.profit.current / stats.revenue.current) * 100) : 0}%`}
          format="currency"
          trend={stats.profit.current >= 0 ? "up" : "down"}
        />
      </StatsGrid>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.expenses.current)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.expenses.count} transações no período
            </p>
            {stats.expenses.change !== 0 && (
              <div className="flex items-center space-x-1 mt-1">
                <span className={`text-xs font-medium ${
                  stats.expenses.change > 0 ? "text-red-600" : "text-green-600"
                }`}>
                  {stats.expenses.change > 0 ? "↗" : "↘"} {Math.abs(stats.expenses.change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs período anterior</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.tasks.completed} de {stats.tasks.total} tarefas
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats.tasks.completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue.count + stats.expenses.count}</div>
            <p className="text-xs text-muted-foreground">
              Transações no período
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{stats.revenue.count} receitas</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>{stats.expenses.count} despesas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Receita Total</span>
              <span className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.revenue.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Despesas Totais</span>
              <span className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.expenses.total)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Lucro Total</span>
              <span className={`font-bold ${
                (stats.revenue.total - stats.expenses.total) >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.revenue.total - stats.expenses.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Clientes</span>
              <span className="font-medium">{stats.summary.totalClients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projetos Ativos</span>
              <span className="font-medium">{stats.summary.activeProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projetos Concluídos</span>
              <span className="font-medium">{stats.projects.completed}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Taxa de Sucesso</span>
              <span className="font-bold text-green-600">
                {stats.projects.total > 0 
                  ? Math.round((stats.projects.completed / stats.projects.total) * 100)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
