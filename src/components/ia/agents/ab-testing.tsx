'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, TestTube, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function ABTestingPlanner() {
  const [formData, setFormData] = useState({
    testElement: '',
    currentVersion: '',
    objective: '',
    audience: '',
    budget: '',
    duration: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.testElement || !formData.currentVersion || !formData.objective) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedPlan(null)

    try {
      const response = await fetch('/api/ai/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedPlan(result.testPlan)
        toast.success('Plano de testes gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar plano de testes')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar plano de testes')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedPlan) {
      navigator.clipboard.writeText(generatedPlan)
      setCopied(true)
      toast.success('Plano copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Planejador de Testes A/B
          </CardTitle>
          <CardDescription>
            Crie planos detalhados de testes A/B para otimizar suas campanhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testElement">
                  Elemento a Testar *
                </Label>
                <Select
                  value={formData.testElement}
                  onValueChange={(value) => setFormData({ ...formData, testElement: value })}
                >
                  <SelectTrigger id="testElement">
                    <SelectValue placeholder="Selecione o elemento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headline">Headline</SelectItem>
                    <SelectItem value="copy">Copy/Texto</SelectItem>
                    <SelectItem value="creative">Criativo/Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="cta">CTA (Call-to-Action)</SelectItem>
                    <SelectItem value="audience">Público</SelectItem>
                    <SelectItem value="placement">Posicionamento</SelectItem>
                    <SelectItem value="offer">Oferta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duração do Teste
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="21">21 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentVersion">
                Versão Atual (Controle) *
              </Label>
              <Textarea
                id="currentVersion"
                placeholder="Descreva a versão atual que será o controle do teste..."
                value={formData.currentVersion}
                onChange={(e) => setFormData({ ...formData, currentVersion: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">
                Objetivo do Teste *
              </Label>
              <Input
                id="objective"
                placeholder="Ex: Aumentar CTR, Reduzir CPA, Melhorar conversões"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">
                Público-alvo
              </Label>
              <Input
                id="audience"
                placeholder="Ex: Mulheres 25-45, interessadas em fitness"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                Orçamento para o Teste
              </Label>
              <Input
                id="budget"
                placeholder="Ex: R$ 500,00"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Plano...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Plano de Testes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedPlan && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Plano de Testes A/B
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Plano
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedPlan}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
