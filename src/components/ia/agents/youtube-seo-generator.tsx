'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Tag, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function YoutubeSeoGenerator() {
  const [formData, setFormData] = useState({
    scriptOrTheme: '',
    videoType: '',
    targetAudience: '',
    keywords: '',
    channelNiche: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSeo, setGeneratedSeo] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.scriptOrTheme) {
      toast.error('Por favor, forneça o roteiro ou tema do vídeo')
      return
    }

    setIsGenerating(true)
    setGeneratedSeo(null)

    try {
      const response = await fetch('/api/ai/youtube-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedSeo(result.seoContent)
        toast.success('SEO gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar SEO')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar SEO')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedSeo) {
      navigator.clipboard.writeText(generatedSeo)
      setCopied(true)
      toast.success('Conteúdo copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gerador de Título, Descrição e Tags
          </CardTitle>
          <CardDescription>
            Otimize seus vídeos para SEO e aumente seu alcance orgânico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scriptOrTheme">
                Roteiro ou Tema do Vídeo *
              </Label>
              <Textarea
                id="scriptOrTheme"
                placeholder="Cole o roteiro completo ou descreva o tema principal do vídeo..."
                value={formData.scriptOrTheme}
                onChange={(e) => setFormData({ ...formData, scriptOrTheme: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="videoType">
                  Tipo de Vídeo
                </Label>
                <Input
                  id="videoType"
                  placeholder="Ex: Tutorial, Review, Vlog, etc."
                  value={formData.videoType}
                  onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Público-alvo
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Iniciantes em programação"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">
                Palavras-chave Principais
              </Label>
              <Input
                id="keywords"
                placeholder="Ex: marketing digital, vendas online, tráfego pago"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelNiche">
                Nicho do Canal
              </Label>
              <Input
                id="channelNiche"
                placeholder="Ex: Tecnologia, Marketing, Finanças"
                value={formData.channelNiche}
                onChange={(e) => setFormData({ ...formData, channelNiche: e.target.value })}
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
                  Gerando SEO...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar SEO Otimizado
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedSeo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              SEO Otimizado
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
                {generatedSeo}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
