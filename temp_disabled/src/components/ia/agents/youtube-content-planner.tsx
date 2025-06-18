'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Calendar, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function YoutubeContentPlanner() {
  const [formData, setFormData] = useState({
    postingFrequency: '',
    targetAudience: '',
    mainThemes: '',
    channelGoals: '',
    duration: '30'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.postingFrequency || !formData.targetAudience || !formData.mainThemes) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedPlan(null)

    try {
      const response = await fetch('/api/ai/youtube-content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedPlan(result.contentPlan)
        toast.success('Calendário editorial gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar planejamento')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar planejamento')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedPlan) {
      navigator.clipboard.writeText(generatedPlan)
      setCopied(true)
      toast.success('Planejamento copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planejador de Conteúdo
          </CardTitle>
          <CardDescription>
            Crie um calendário editorial completo para seu canal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postingFrequency">
                  Frequência de Postagens *
                </Label>
                <Select
                  value={formData.postingFrequency}
                  onValueChange={(value) => setFormData({ ...formData, postingFrequency: value })}
                >
                  <SelectTrigger id="postingFrequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x semana">1x por semana</SelectItem>
                    <SelectItem value="2x semana">2x por semana</SelectItem>
                    <SelectItem value="3x semana">3x por semana</SelectItem>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="2x dia">2x por dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Período do Calendário
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">
                Público-alvo *
              </Label>
              <Input
                id="targetAudience"
                placeholder="Ex: Jovens de 18-25 anos interessados em tecnologia"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainThemes">
                Temas Principais *
              </Label>
              <Textarea
                id="mainThemes"
                placeholder="Ex: Tutoriais de programação, reviews de tecnologia, dicas de produtividade..."
                value={formData.mainThemes}
                onChange={(e) => setFormData({ ...formData, mainThemes: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelGoals">
                Objetivos do Canal
              </Label>
              <Textarea
                id="channelGoals"
                placeholder="Ex: Alcançar 10k inscritos, monetizar o canal, construir autoridade no nicho..."
                value={formData.channelGoals}
                onChange={(e) => setFormData({ ...formData, channelGoals: e.target.value })}
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
                  Gerando Calendário...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Calendário Editorial
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
              <Calendar className="h-5 w-5" />
              Calendário Editorial
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
                  Copiar Calendário
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
