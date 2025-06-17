'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { EbookWizardQueue } from '@/components/ebook/ebook-wizard-queue'
import { EbookList } from '@/components/ebook/ebook-list'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  BookOpen, 
  FileDown,
  Calendar,
  User
} from 'lucide-react'

type ViewMode = 'list' | 'wizard' | 'view'

interface Ebook {
  id: string
  title: string
  description?: string
  content?: string
  status: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
}

export default function EbookPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null)

  const handleCreateNew = () => {
    setViewMode('wizard')
  }

  const handleWizardComplete = (ebook: Ebook) => {
    setSelectedEbook(ebook)
    setViewMode('view')
  }

  const handleViewEbook = (ebook: Ebook) => {
    setSelectedEbook(ebook)
    setViewMode('view')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedEbook(null)
  }

  if (viewMode === 'wizard') {
    return (
      <>
        <PageHeader
          title="Criar Ebook"
          description="Gere um ebook completo com IA em poucos passos"
          action={
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          }
        />
        
        <div className="py-8">
          <EbookWizardQueue onComplete={handleWizardComplete} />
        </div>
      </>
    )
  }

  if (viewMode === 'view' && selectedEbook) {
    const description = selectedEbook.description 
      ? (typeof selectedEbook.description === 'string' 
          ? JSON.parse(selectedEbook.description) 
          : selectedEbook.description)
      : null
    
    const content = selectedEbook.content 
      ? (typeof selectedEbook.content === 'string' 
          ? JSON.parse(selectedEbook.content) 
          : selectedEbook.content)
      : null

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

    return (
      <>
        <PageHeader
          title={selectedEbook.title}
          description="Detalhes do ebook"
          action={
            <div className="flex gap-2">
              {selectedEbook.pdfUrl && (
                <Button asChild>
                  <a href={selectedEbook.pdfUrl} download target="_blank">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          }
        />
        
        <div className="py-8 space-y-6">
          {/* Status e Informações */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Informações Gerais</h2>
              </div>
              
              <Badge 
                className={`${statusConfig[selectedEbook.status as keyof typeof statusConfig]?.color || 'bg-gray-500'} text-white`}
              >
                {statusConfig[selectedEbook.status as keyof typeof statusConfig]?.label || selectedEbook.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="font-medium">
                    {new Date(selectedEbook.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {description?.targetAudience && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Público-alvo</p>
                    <p className="font-medium">{description.targetAudience}</p>
                  </div>
                </div>
              )}

              {description?.totalPages && (
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Páginas</p>
                    <p className="font-medium">{description.totalPages} páginas</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Descrição */}
          {description && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Descrição</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{description.description}</p>

              {description.objectives && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Objetivos de Aprendizado</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {description.objectives.map((obj: string, index: number) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {description.benefits && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Benefícios</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {description.benefits.map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Capítulos */}
          {description?.chapters && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estrutura do Ebook</h3>
              <div className="space-y-3">
                {description.chapters.map((chapter: { number: number; title: string; description?: string; pages: number }) => (
                  <div key={chapter.number} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        Cap. {chapter.number}
                      </span>
                      <h4 className="font-medium">{chapter.title}</h4>
                      <span className="text-sm text-gray-500 ml-auto">
                        {chapter.pages} páginas
                      </span>
                    </div>
                    {chapter.description && (
                      <p className="text-gray-600 text-sm">{chapter.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conteúdo Gerado */}
          {content && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conteúdo</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{content.chapters?.length || 0}</p>
                  <p className="text-sm text-gray-600">Capítulos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {content.metadata?.totalPages || 50}
                  </p>
                  <p className="text-sm text-gray-600">Páginas</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {content.metadata?.generatedAt 
                      ? new Date(content.metadata.generatedAt).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-600">Gerado em</p>
                </div>
              </div>

              {selectedEbook.status === 'completed' && selectedEbook.pdfUrl ? (
                <div className="text-center">
                  <p className="text-green-600 mb-4">✓ Ebook completo e disponível para download</p>
                  <Button asChild size="lg">
                    <a href={selectedEbook.pdfUrl} download target="_blank">
                      <FileDown className="w-4 h-4 mr-2" />
                      Download PDF Completo
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>PDF em processamento ou não disponível</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </>
    )
  }

  // Lista padrão
  return (
    <>
      <PageHeader
        title="Ebooks"
        description="Crie ebooks completos com inteligência artificial"
      />
      
      <div className="py-8">
        <EbookList 
          onCreateNew={handleCreateNew}
          onViewEbook={handleViewEbook}
        />
      </div>
    </>
  )
}