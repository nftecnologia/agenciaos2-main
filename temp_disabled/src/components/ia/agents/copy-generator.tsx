'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, PenTool, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function CopyGenerator() {
  const [formData, setFormData] = useState({
    objective: '',
    product: '',
    persona: '',
    tone: '',
    benefits: '',
    painPoints: '',
    offer: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCopies, setGeneratedCopies] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.objective || !formData.product || !formData.tone) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedCopies(null)

    try {
      const response = await fetch('/api/ai/copy-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedCopies(result.copies)
        toast.success('Copies geradas com sucesso!')
      } else {
        toast.error('Erro ao gerar copies')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar copies')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCopies) {
      navigator.clipboard.writeText(generatedCopies)
      setCopied(true)
      toast.success('Copies copiadas!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Gerador de Copies
          </CardTitle>
          <CardDescription>
            Crie copies persuasivas otimizadas para Meta Ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objective">
                  Objetivo da Campanha *
                </Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value) => setFormData({ ...formData, objective: value })}
                >
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas Diretas</SelectItem>
                    <SelectItem value="leads">Geração de Leads</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="trafego">Tráfego para Site</SelectItem>
                    <SelectItem value="app">Download de App</SelectItem>
                    <SelectItem value="awareness">Reconhecimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">
                  Tom da Copy *
                </Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => setFormData({ ...formData, tone: value })}
                >
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgencia">Urgência</SelectItem>
                    <SelectItem value="autoridade">Autoridade</SelectItem>
                    <SelectItem value="emocional">Emocional</SelectItem>
                    <SelectItem value="beneficio">Benefício</SelectItem>
                    <SelectItem value="escassez">Escassez</SelectItem>
                    <SelectItem value="social">Prova Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">
                Produto/Serviço *
              </Label>
              <Input
                id="product"
                placeholder="Ex: Curso de Marketing Digital"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">
                Persona/Público-alvo
              </Label>
              <Input
                id="persona"
                placeholder="Ex: Empreendedores iniciantes, 25-40 anos"
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">
                Principais Benefícios
              </Label>
              <Textarea
                id="benefits"
                placeholder="Liste os principais benefícios do seu produto/serviço..."
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="painPoints">
                Dores do Cliente
              </Label>
              <Textarea
                id="painPoints"
                placeholder="Quais problemas seu produto resolve?"
                value={formData.painPoints}
                onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer">
                Oferta Especial
              </Label>
              <Input
                id="offer"
                placeholder="Ex: 50% OFF hoje, Frete Grátis, Bônus exclusivo"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
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
                  Gerando Copies...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Copies
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedCopies && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Copies Geradas
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
                  Copiar Tudo
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedCopies}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
