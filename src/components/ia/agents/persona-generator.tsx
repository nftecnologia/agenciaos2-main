'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User, Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function PersonaGenerator() {
  const [formData, setFormData] = useState({
    businessSegment: '',
    averageTicket: '',
    clientType: '',
    audienceProblems: '',
    region: '',
    additionalInfo: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPersona, setGeneratedPersona] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.businessSegment || !formData.clientType) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsGenerating(true)
    setGeneratedPersona(null)

    try {
      const response = await fetch('/api/ai/persona-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedPersona(result.persona)
        toast.success('Persona gerada com sucesso!')
      } else {
        toast.error('Erro ao gerar persona')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar persona')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedPersona) {
      navigator.clipboard.writeText(generatedPersona)
      setCopied(true)
      toast.success('Persona copiada!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Gerador de Persona
          </CardTitle>
          <CardDescription>
            Crie personas detalhadas para suas campanhas de marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessSegment">
                  Segmento do Negócio *
                </Label>
                <Input
                  id="businessSegment"
                  placeholder="Ex: E-commerce de moda feminina"
                  value={formData.businessSegment}
                  onChange={(e) => setFormData({ ...formData, businessSegment: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageTicket">
                  Ticket Médio
                </Label>
                <Input
                  id="averageTicket"
                  placeholder="Ex: R$ 150,00"
                  value={formData.averageTicket}
                  onChange={(e) => setFormData({ ...formData, averageTicket: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientType">
                  Tipo de Cliente *
                </Label>
                <Input
                  id="clientType"
                  placeholder="Ex: Mulheres 25-45 anos"
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">
                  Região
                </Label>
                <Input
                  id="region"
                  placeholder="Ex: São Paulo - SP"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceProblems">
                Problemas/Desejos do Público
              </Label>
              <Textarea
                id="audienceProblems"
                placeholder="Descreva as principais dores, desejos e necessidades do seu público..."
                value={formData.audienceProblems}
                onChange={(e) => setFormData({ ...formData, audienceProblems: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                Informações Adicionais
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Adicione qualquer informação relevante..."
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
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
                  Gerando Persona...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Persona
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedPersona && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Persona Gerada
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
              <pre className="whitespace-pre-wrap text-sm">
                {generatedPersona}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
