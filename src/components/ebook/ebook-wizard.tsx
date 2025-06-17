'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Wand2, 
  Check, 
  FileDown,
  Loader2,
  Edit3,
  Users,
  Building
} from 'lucide-react'

interface EbookWizardProps {
  onComplete: (ebook: EbookData) => void
}

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

interface StepProps {
  currentStep: number
  totalSteps: number
}

const StepIndicator = ({ currentStep, totalSteps }: StepProps) => (
  <div className="flex items-center justify-center mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
            ${i + 1 <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-500'
            }`}
        >
          {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div 
            className={`w-16 h-1 mx-2 transition-colors
              ${i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
            `} 
          />
        )}
      </div>
    ))}
  </div>
)

export function EbookWizard({ onComplete }: EbookWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [ebook, setEbook] = useState<EbookData | null>(null)

  // Step 1: Informações básicas
  const [title, setTitle] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [industry, setIndustry] = useState('')

  // Step 2: Descrição gerada
  const [generatedDescription, setGeneratedDescription] = useState<Record<string, unknown> | null>(null)
  const [editedDescription, setEditedDescription] = useState('')

  // Step 3: Geração de conteúdo
  const [generatedContent, setGeneratedContent] = useState<Record<string, unknown> | null>(null)

  // Step 4: PDF final
  const [pdfUrl, setPdfUrl] = useState('')

  const handleStep1Submit = async () => {
    if (!title.trim()) return

    setIsLoading(true)
    try {
      // Criar ebook inicial
      const createResponse = await fetch('/api/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetAudience, industry })
      })

      if (!createResponse.ok) throw new Error('Erro ao criar ebook')
      const createData = await createResponse.json()
      setEbook(createData.data)

      // Gerar descrição
      const descResponse = await fetch('/api/ebook/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetAudience, industry })
      })

      if (!descResponse.ok) throw new Error('Erro ao gerar descrição')
      const descData = await descResponse.json()
      setGeneratedDescription(descData.data)
      setEditedDescription(descData.data.description)

      setCurrentStep(2)
    } catch (error) {
      console.error('Erro no step 1:', error)
      alert('Erro ao gerar descrição. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Approve = async () => {
    if (!ebook || !generatedDescription) return

    setIsLoading(true)
    try {
      // Atualizar ebook com descrição aprovada
      await fetch(`/api/ebook/${ebook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: {
            ...generatedDescription,
            description: editedDescription
          },
          status: 'description_approved'
        })
      })

      setCurrentStep(3)
    } catch (error) {
      console.error('Erro no step 2:', error)
      alert('Erro ao aprovar descrição. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep3Generate = async () => {
    if (!ebook || !generatedDescription) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ebook/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookId: ebook.id,
          approvedDescription: {
            ...generatedDescription,
            description: editedDescription
          }
        })
      })

      if (!response.ok) throw new Error('Erro ao gerar conteúdo')
      const data = await response.json()
      setGeneratedContent(data.data)

      setCurrentStep(4)
    } catch (error) {
      console.error('Erro no step 3:', error)
      alert('Erro ao gerar conteúdo. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep4GeneratePDF = async () => {
    if (!ebook) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ebook/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId: ebook.id })
      })

      if (!response.ok) throw new Error('Erro ao gerar PDF')
      const data = await response.json()
      setPdfUrl(data.pdfUrl)

      onComplete({ ...ebook, pdfUrl: data.pdfUrl })
    } catch (error) {
      console.error('Erro no step 4:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {/* Step 1: Informações Básicas */}
      {currentStep === 1 && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Criar Novo Ebook</h2>
            <p className="text-gray-600">Vamos começar com as informações básicas do seu ebook</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título do Ebook *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Guia Completo de Marketing Digital"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Público-alvo
              </label>
              <Input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Empreendedores iniciantes, Profissionais de marketing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Setor/Indústria
              </label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Ex: E-commerce, SaaS, Consultoria"
              />
            </div>

            <Button 
              onClick={handleStep1Submit}
              disabled={!title.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando descrição...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> Gerar Descrição com IA</>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Revisar Descrição */}
      {currentStep === 2 && generatedDescription && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <Edit3 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Revisar Descrição</h2>
            <p className="text-gray-600">Revise e edite a descrição gerada pela IA</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Informações do Ebook</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Público-alvo:</span>
                  <p className="font-medium">{String(generatedDescription.targetAudience)}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Dificuldade:</span>
                  <Badge variant="secondary">{String(generatedDescription.difficulty)}</Badge>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Páginas:</span>
                  <p className="font-medium">{String(generatedDescription.totalPages)} páginas</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Tempo de leitura:</span>
                  <p className="font-medium">{String(generatedDescription.estimatedReadTime)}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Capítulos:</span>
                  <div className="space-y-2 mt-2">
                    {(generatedDescription.chapters as { number: number; title: string; description?: string; pages: number }[])?.map((chapter) => (
                      <div key={chapter.number} className="text-sm">
                        <span className="font-medium">Cap. {chapter.number}:</span> {chapter.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Descrição (Editável)</h3>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={15}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button 
              onClick={handleStep2Approve}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Aprovando...</>
              ) : (
                <><Check className="w-4 h-4 mr-2" /> Aprovar e Continuar</>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Gerar Conteúdo */}
      {currentStep === 3 && (
        <Card className="p-8 text-center">
          <Wand2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Gerar Conteúdo Completo</h2>
          <p className="text-gray-600 mb-8">
            Agora vamos gerar o conteúdo completo do ebook com 50 páginas
          </p>

          {generatedContent ? (
            <div className="space-y-4">
              <Badge variant="default" className="bg-green-600">
                ✓ Conteúdo gerado com sucesso!
              </Badge>
              <p className="text-sm text-gray-600">
{(generatedContent.chapters as unknown[])?.length || 0} capítulos gerados
              </p>
              <Button onClick={() => setCurrentStep(4)} size="lg">
                Continuar para PDF
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleStep3Generate}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando conteúdo...</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" /> Gerar Conteúdo</>
              )}
            </Button>
          )}
        </Card>
      )}

      {/* Step 4: Gerar PDF */}
      {currentStep === 4 && (
        <Card className="p-8 text-center">
          <FileDown className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Gerar PDF Final</h2>
          <p className="text-gray-600 mb-8">
            Última etapa: vamos diagramar e gerar o PDF do seu ebook
          </p>

          {pdfUrl ? (
            <div className="space-y-4">
              <Badge variant="default" className="bg-green-600">
                ✓ PDF gerado com sucesso!
              </Badge>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a href={pdfUrl} download target="_blank">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
                <Button variant="outline" onClick={() => ebook && onComplete({ ...ebook, pdfUrl })}>
                  Finalizar
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleStep4GeneratePDF}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando PDF...</>
              ) : (
                <><FileDown className="w-4 h-4 mr-2" /> Gerar PDF</>
              )}
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}