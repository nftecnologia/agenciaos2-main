'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Target, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function AudienceSegmentation() {
  const [formData, setFormData] = useState({
    campaignObjective: '',
    targetAudience: '',
    region: '',
    budget: '',
    productService: '',
    additionalDetails: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSegmentation, setGeneratedSegmentation] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.campaignObjective || !formData.targetAudience || !formData.productService) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedSegmentation(null)

    try {
      const response = await fetch('/api/ai/audience-segmentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedSegmentation(result.segmentation)
        toast.success('Segmentação gerada com sucesso!')
      } else {
        toast.error('Erro ao gerar segmentação')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar segmentação')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedSegmentation) {
      navigator.clipboard.writeText(generatedSegmentation)
      setCopied(true)
      toast.success('Segmentação copiada!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Segmentação de Público
          </CardTitle>
          <CardDescription>
            Gere segmentações detalhadas para suas campanhas no Meta Ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignObjective">
                  Objetivo da Campanha *
                </Label>
                <Select
                  value={formData.campaignObjective}
                  onValueChange={(value) => setFormData({ ...formData, campaignObjective: value })}
                >
                  <SelectTrigger id="campaignObjective">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Reconhecimento</SelectItem>
                    <SelectItem value="traffic">Tráfego</SelectItem>
                    <SelectItem value="engagement">Engajamento</SelectItem>
                    <SelectItem value="leads">Geração de Leads</SelectItem>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="app">Promoção de App</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">
                  Orçamento Diário
                </Label>
                <Input
                  id="budget"
                  placeholder="Ex: R$ 50,00"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Público-alvo Geral *
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Mulheres 25-45 interessadas em fitness"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">
                  Região/Localização
                </Label>
                <Input
                  id="region"
                  placeholder="Ex: Brasil, São Paulo, Rio de Janeiro"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productService">
                Produto/Serviço *
              </Label>
              <Textarea
                id="productService"
                placeholder="Descreva o produto ou serviço que você está promovendo..."
                value={formData.productService}
                onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">
                Detalhes Adicionais
              </Label>
              <Textarea
                id="additionalDetails"
                placeholder="Informações sobre concorrentes, sazonalidade, promoções..."
                value={formData.additionalDetails}
                onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                rows={2}
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
                  Gerando Segmentação...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Segmentação
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedSegmentation && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Segmentação Gerada
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
                  Copiar
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedSegmentation}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
