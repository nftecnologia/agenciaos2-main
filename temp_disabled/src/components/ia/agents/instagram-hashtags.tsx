'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Hash, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function InstagramHashtags() {
  const [formData, setFormData] = useState({
    theme: '',
    targetAudience: '',
    postType: '',
    niche: '',
    objectives: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedHashtags, setGeneratedHashtags] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.theme || !formData.targetAudience) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedHashtags(null)

    try {
      const response = await fetch('/api/ai/instagram-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedHashtags(result.hashtags)
        toast.success('Hashtags geradas com sucesso!')
      } else {
        toast.error('Erro ao gerar hashtags')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar hashtags')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedHashtags) {
      navigator.clipboard.writeText(generatedHashtags)
      setCopied(true)
      toast.success('Hashtags copiadas!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Gerador de Hashtags
          </CardTitle>
          <CardDescription>
            Otimize seu alcance com hashtags estratégicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">
                  Tema do Post *
                </Label>
                <Input
                  id="theme"
                  placeholder="Ex: Marketing digital, fitness, receitas"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">
                  Público-alvo *
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Empreendedores iniciantes"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="reels">Reels</SelectItem>
                    <SelectItem value="stories">Stories</SelectItem>
                    <SelectItem value="carousel">Carrossel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">
                  Nicho
                </Label>
                <Input
                  id="niche"
                  placeholder="Ex: Marketing, Saúde, Tecnologia"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">
                Objetivos
              </Label>
              <Input
                id="objectives"
                placeholder="Ex: Aumentar alcance, gerar engajamento, atrair seguidores"
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
                  Gerando Hashtags...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Hashtags Estratégicas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedHashtags && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Hashtags Otimizadas
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
                  Copiar Hashtags
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {generatedHashtags}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
