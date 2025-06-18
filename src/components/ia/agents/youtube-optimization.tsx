'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, RefreshCw, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function YoutubeOptimization() {
  const [formData, setFormData] = useState({
    oldTitle: '',
    oldDescription: '',
    oldTags: '',
    videoTopic: '',
    performance: '',
    channelNiche: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOptimization, setGeneratedOptimization] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.oldTitle || !formData.videoTopic) {
      toast.error('Por favor, forneça pelo menos o título e o tópico do vídeo')
      return
    }

    setIsGenerating(true)
    setGeneratedOptimization(null)

    try {
      const response = await fetch('/api/ai/youtube-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedOptimization(result.optimization)
        toast.success('Otimização gerada com sucesso!')
      } else {
        toast.error('Erro ao gerar otimização')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar otimização')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedOptimization) {
      navigator.clipboard.writeText(generatedOptimization)
      setCopied(true)
      toast.success('Otimização copiada!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Otimização de Vídeos Antigos
          </CardTitle>
          <CardDescription>
            Dê nova vida aos seus vídeos com baixo desempenho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldTitle">
                Título Atual do Vídeo *
              </Label>
              <Input
                id="oldTitle"
                placeholder="Cole o título atual do vídeo"
                value={formData.oldTitle}
                onChange={(e) => setFormData({ ...formData, oldTitle: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoTopic">
                Tópico/Assunto do Vídeo *
              </Label>
              <Input
                id="videoTopic"
                placeholder="Ex: Como criar thumbnails profissionais"
                value={formData.videoTopic}
                onChange={(e) => setFormData({ ...formData, videoTopic: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldDescription">
                Descrição Atual
              </Label>
              <Textarea
                id="oldDescription"
                placeholder="Cole a descrição atual do vídeo (opcional)"
                value={formData.oldDescription}
                onChange={(e) => setFormData({ ...formData, oldDescription: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldTags">
                Tags Atuais
              </Label>
              <Input
                id="oldTags"
                placeholder="Ex: design, photoshop, tutorial (separadas por vírgula)"
                value={formData.oldTags}
                onChange={(e) => setFormData({ ...formData, oldTags: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="performance">
                  Performance Atual
                </Label>
                <Input
                  id="performance"
                  placeholder="Ex: 500 views, baixo CTR"
                  value={formData.performance}
                  onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelNiche">
                  Nicho do Canal
                </Label>
                <Input
                  id="channelNiche"
                  placeholder="Ex: Design Gráfico"
                  value={formData.channelNiche}
                  onChange={(e) => setFormData({ ...formData, channelNiche: e.target.value })}
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
                  Gerando Otimização...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Otimização Completa
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedOptimization && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Estratégia de Otimização
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
                  Copiar Estratégia
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedOptimization}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
