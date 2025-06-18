'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Layout, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function InstagramCarouselText() {
  const [formData, setFormData] = useState({
    theme: '',
    objective: '',
    targetAudience: '',
    numberOfSlides: '',
    visualStyle: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCarousel, setGeneratedCarousel] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.theme || !formData.objective) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedCarousel(null)

    try {
      const response = await fetch('/api/ai/instagram-carousel-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedCarousel(result.carousel)
        toast.success('Carrossel textual gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar carrossel')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar carrossel')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCarousel) {
      navigator.clipboard.writeText(generatedCarousel)
      setCopied(true)
      toast.success('Carrossel copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Gerador de Carrossel Textual
          </CardTitle>
          <CardDescription>
            Crie carrosséis textuais envolventes e estruturados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">
                Tema Central *
              </Label>
              <Textarea
                id="theme"
                placeholder="Ex: 5 erros que impedem suas vendas online"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objective">
                  Objetivo do Carrossel *
                </Label>
                <Input
                  id="objective"
                  placeholder="Ex: Educar, vender, engajar"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfSlides">
                  Número de Slides
                </Label>
                <Select
                  value={formData.numberOfSlides}
                  onValueChange={(value) => setFormData({ ...formData, numberOfSlides: value })}
                >
                  <SelectTrigger id="numberOfSlides">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 slides</SelectItem>
                    <SelectItem value="6">6 slides</SelectItem>
                    <SelectItem value="7">7 slides</SelectItem>
                    <SelectItem value="8">8 slides</SelectItem>
                    <SelectItem value="10">10 slides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Público-alvo
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Empreendedores digitais"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visualStyle">
                  Estilo Visual
                </Label>
                <Input
                  id="visualStyle"
                  placeholder="Ex: Minimalista, colorido, profissional"
                  value={formData.visualStyle}
                  onChange={(e) => setFormData({ ...formData, visualStyle: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Carrossel...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Carrossel Textual
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedCarousel && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Carrossel Textual
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
                  Copiar Carrossel
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedCarousel}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
