'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Edit3, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function InstagramCaptionGenerator() {
  const [formData, setFormData] = useState({
    theme: '',
    objective: '',
    targetAudience: '',
    toneOfVoice: '',
    briefing: '',
    postType: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.theme || !formData.objective) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedCaption(null)

    try {
      const response = await fetch('/api/ai/instagram-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedCaption(result.caption)
        toast.success('Legenda gerada com sucesso!')
      } else {
        toast.error('Erro ao gerar legenda')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar legenda')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption)
      setCopied(true)
      toast.success('Legenda copiada!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Gerador de Legendas
          </CardTitle>
          <CardDescription>
            Crie legendas engajadoras e persuasivas para seus posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">
                Tema do Post *
              </Label>
              <Textarea
                id="theme"
                placeholder="Ex: Dicas de marketing digital para pequenas empresas"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objective">
                  Objetivo *
                </Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value) => setFormData({ ...formData, objective: value })}
                >
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="engajamento">Engajamento</SelectItem>
                    <SelectItem value="educativo">Educativo</SelectItem>
                    <SelectItem value="institucional">Institucional</SelectItem>
                    <SelectItem value="entretenimento">Entretenimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postType">
                  Tipo de Post
                </Label>
                <Select
                  value={formData.postType}
                  onValueChange={(value) => setFormData({ ...formData, postType: value })}
                >
                  <SelectTrigger id="postType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">Feed</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="reels">Reels</SelectItem>
                    <SelectItem value="carousel">Carrossel</SelectItem>
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
                  placeholder="Ex: Empreendedores, 25-40 anos"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toneOfVoice">
                  Tom de Voz
                </Label>
                <Input
                  id="toneOfVoice"
                  placeholder="Ex: Profissional, amigável, inspirador"
                  value={formData.toneOfVoice}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="briefing">
                Briefing Adicional
              </Label>
              <Textarea
                id="briefing"
                placeholder="Informações extras, pontos importantes a incluir, referências..."
                value={formData.briefing}
                onChange={(e) => setFormData({ ...formData, briefing: e.target.value })}
                rows={3}
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
                  Gerando Legenda...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Legenda
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedCaption && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Legenda Gerada
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
                {generatedCaption}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
