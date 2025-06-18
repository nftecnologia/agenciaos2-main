'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lightbulb, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function InstagramPostIdeas() {
  const [formData, setFormData] = useState({
    niche: '',
    targetAudience: '',
    specialDates: '',
    themes: '',
    objectives: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.niche || !formData.targetAudience) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedIdeas(null)

    try {
      const response = await fetch('/api/ai/instagram-post-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedIdeas(result.ideas)
        toast.success('Ideias geradas com sucesso!')
      } else {
        toast.error('Erro ao gerar ideias')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar ideias')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedIdeas) {
      navigator.clipboard.writeText(generatedIdeas)
      setCopied(true)
      toast.success('Ideias copiadas!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Gerador de Ideias de Posts
          </CardTitle>
          <CardDescription>
            Nunca mais fique sem ideias criativas para seu Instagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niche">
                  Nicho *
                </Label>
                <Input
                  id="niche"
                  placeholder="Ex: Marketing Digital, Fitness, Moda"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Público-alvo *
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Mulheres 25-35, empreendedoras"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="themes">
                Temas de Interesse
              </Label>
              <Textarea
                id="themes"
                placeholder="Ex: Produtividade, vendas online, mindset empreendedor..."
                value={formData.themes}
                onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialDates">
                Datas Especiais
              </Label>
              <Input
                id="specialDates"
                placeholder="Ex: Black Friday, Dia das Mães, Natal"
                value={formData.specialDates}
                onChange={(e) => setFormData({ ...formData, specialDates: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">
                Objetivos
              </Label>
              <Input
                id="objectives"
                placeholder="Ex: Aumentar vendas, gerar engajamento, educar"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
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
                  Gerando Ideias...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Ideias de Posts
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedIdeas && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Ideias Geradas
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
                  Copiar Ideias
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedIdeas}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
