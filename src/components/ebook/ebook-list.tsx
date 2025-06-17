'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  FileDown, 
  Trash2, 
  Search,
  Plus,
  Eye,
  Calendar,
  Filter
} from 'lucide-react'

interface EbookData {
  id: string
  title: string
  description?: string
  content?: string
  status: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
}

interface EbookListProps {
  onCreateNew: () => void
  onViewEbook: (ebook: EbookData) => void
}

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-500' },
  description_generated: { label: 'Descrição Gerada', color: 'bg-blue-500' },
  description_approved: { label: 'Descrição Aprovada', color: 'bg-green-500' },
  generating: { label: 'Gerando Conteúdo', color: 'bg-yellow-500' },
  content_ready: { label: 'Conteúdo Pronto', color: 'bg-purple-500' },
  generating_pdf: { label: 'Gerando PDF', color: 'bg-indigo-500' },
  completed: { label: 'Concluído', color: 'bg-green-600' },
  error: { label: 'Erro', color: 'bg-red-500' }
}

export function EbookList({ onCreateNew, onViewEbook }: EbookListProps) {
  const [ebooks, setEbooks] = useState<EbookData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    loadEbooks()
  }, [])

  const loadEbooks = async () => {
    try {
      const response = await fetch('/api/ebook')
      if (response.ok) {
        const data = await response.json()
        setEbooks(data.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar ebooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ebook?')) return

    try {
      const response = await fetch(`/api/ebook/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEbooks(ebooks.filter(e => e.id !== id))
      } else {
        alert('Erro ao excluir ebook')
      }
    } catch (error) {
      console.error('Erro ao excluir ebook:', error)
      alert('Erro ao excluir ebook')
    }
  }

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || ebook.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Ebooks</h1>
          <p className="text-gray-600">Gerencie seus ebooks criados com IA</p>
        </div>
        
        <Button onClick={onCreateNew} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ebook
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título..."
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {filteredEbooks.length} ebook(s) encontrado(s)
          </div>
        </div>
      </Card>

      {/* Lista de Ebooks */}
      {filteredEbooks.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || statusFilter ? 'Nenhum ebook encontrado' : 'Nenhum ebook criado ainda'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro ebook com IA em poucos minutos'
            }
          </p>
          {!searchTerm && !statusFilter && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Ebook
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">{ebook.title}</h3>
                    <Badge 
                      className={`${statusConfig[ebook.status as keyof typeof statusConfig]?.color || 'bg-gray-500'} text-white`}
                    >
                      {statusConfig[ebook.status as keyof typeof statusConfig]?.label || ebook.status}
                    </Badge>
                  </div>

                  {ebook.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {typeof ebook.description === 'string' 
                        ? JSON.parse(ebook.description).description 
                        : (ebook.description as { description: string }).description
                      }
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(ebook.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewEbook(ebook)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>

                  {ebook.pdfUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={ebook.pdfUrl} download target="_blank">
                        <FileDown className="w-4 h-4 mr-1" />
                        PDF
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ebook.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}