'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Instagram, Download, Loader2, Sparkles, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SlideContent {
  id: number
  title: string
  content: string
  slideNumber: string
  author_name: string
  author_tag: string
  cta?: string
  cta_final?: string
  image_url?: string
  progress?: number
}

interface GeneratedCarousel {
  slides: SlideContent[]
  images?: string[]
}

export function InstagramCarouselGenerator() {
  const [topic, setTopic] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorTag, setAuthorTag] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [generatedCarousel, setGeneratedCarousel] = useState<GeneratedCarousel | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null)

  const handleAuthorTagChange = (value: string) => {
    // Remove todos os @ do input
    let cleanTag = value.replace(/@/g, '')
    // Adiciona um único @ no início se não estiver vazio
    if (cleanTag) {
      cleanTag = '@' + cleanTag
    }
    setAuthorTag(cleanTag)
  }

  const generateCarousel = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setShowResults(false)

    try {
      const contentResponse = await fetch('/api/instagram/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic,
          brandConfig: {
            agencyName: authorName,
            agencyTag: authorTag
          }
        })
      })

      const contentResult = await contentResponse.json()

      if (contentResult.success) {
        const slides: SlideContent[] = contentResult.data.slides.map((slide: {
          title: string
          content: string
          cta_final?: string
        }, index: number) => ({
          id: index + 1,
          slideNumber: `Slide ${index + 1}`,
          title: slide.title,
          content: slide.content,
          author_name: authorName,
          author_tag: authorTag,
          ...(index === 1 ? { progress: 40 } : {}),
          ...(index === 2 ? { progress: 60 } : {}),
          ...(index === 3 ? { progress: 80 } : {}),
          ...(index === 4 ? { cta: slide.cta_final } : { cta: "ARRASTE" })
        }))

        setGeneratedCarousel({ slides })
        toast.success('Conteúdo gerado! Agora você pode gerar as imagens.')
      } else {
        console.error('Erro ao gerar conteúdo:', contentResult.error)
        toast.error('Erro ao gerar conteúdo. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      toast.error('Erro na requisição. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateImages = async () => {
    if (!generatedCarousel) return

    setIsGeneratingImages(true)
    setShowResults(false)
    setGeneratedImages(null)

    toast.loading('Gerando conteúdo do carrossel...', { id: 'carousel' })

    try {
      const slides = generatedCarousel.slides.map(slide => ({
        title: slide.title,
        content: slide.content,
        cta: slide.cta
      }))

      const response = await fetch('/api/instagram/generate-carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          brandConfig: {
            agencyName: authorName,
            contactInfo: authorTag,
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ Imagens geradas com sucesso:', result.data.images)
        setGeneratedImages(result.data.images.map((img: { url: string }) => img.url))
        setShowResults(true)
        toast.success('Carrossel gerado com sucesso!', { id: 'carousel' })
      } else {
        console.error('❌ Erro ao gerar imagens:', result.error)
        toast.error('Erro ao gerar imagens. Tente novamente.', { id: 'carousel' })
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      toast.error('Erro na requisição. Tente novamente.', { id: 'carousel' })
    } finally {
      setIsGeneratingImages(false)
    }
  }


  const downloadAll = async () => {
    if (!generatedImages) return

    try {
      setIsDownloading(true)
      toast.loading('Baixando todas as imagens...', { id: 'download-all' })

      // Criar uma função para baixar uma imagem
      const downloadImage = async (imageUrl: string, index: number) => {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `slide-${index + 1}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      // Baixar todas as imagens com um pequeno delay entre cada uma
      for (let i = 0; i < generatedImages.length; i++) {
        await downloadImage(generatedImages[i], i)
        // Pequeno delay para evitar problemas com muitos downloads simultâneos
        if (i < generatedImages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      toast.success('Todas as imagens foram baixadas!', { id: 'download-all' })
    } catch (error) {
      console.error('Erro ao baixar imagens:', error)
      toast.error('Erro ao baixar imagens. Tente novamente.', { id: 'download-all' })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!showResults ? (
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
              <Instagram className="h-4 w-4" />
              Instagram Carousel Generator
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                Crie Carrosséis Profissionais em <span className="text-blue-600">Minutos</span>
              </h2>
              <p className="text-muted-foreground">
                Transforme suas ideias em carrosséis incríveis para Instagram com nossa IA avançada
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="text-left space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Geração de Conteúdo por IA</p>
                    <p className="text-sm text-muted-foreground">
                      Descreva seu assunto e deixe a IA criar o conteúdo perfeito
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-left block">
                  Assunto do Carrossel
                </label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="dicas de marketing"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-left block">
                  Nome do Autor
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-left block">
                  @ do Instagram
                </label>
                <input
                  type="text"
                  value={authorTag}
                  onChange={(e) => handleAuthorTagChange(e.target.value)}
                  placeholder="@seu.perfil"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <Button 
                onClick={generateCarousel}
                disabled={!topic.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Gerando conteúdo...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Gerar Conteúdo com IA
                  </>
                )}
              </Button>
            </div>

            {generatedCarousel && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Conteúdo Gerado ({generatedCarousel.slides.length} slides)</span>
                </div>
                
                <Button
                  onClick={generateImages}
                  variant="outline"
                  className="w-full max-w-md"
                  disabled={isGeneratingImages}
                >
                  {isGeneratingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando imagens...
                    </>
                  ) : (
                    <>
                      <Instagram className="h-4 w-4 mr-2" />
                      Gerar Imagens
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Carrossel Pronto!</h3>
              <p className="text-muted-foreground">
                Suas imagens estão prontas para download
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false)
                  setTopic('')
                  setGeneratedCarousel(null)
                  setGeneratedImages(null)
                }}
              >
                Novo Carrossel
              </Button>
              <Button 
                onClick={downloadAll}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Todas
                  </>
                )}
              </Button>
            </div>
          </div>

          {showResults && generatedImages && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Carrossel Gerado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative flex flex-col gap-2 group">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden border border-gray-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={async () => {
                          try {
                            const response = await fetch(imageUrl)
                            const blob = await response.blob()
                            const url = window.URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `slide-${index + 1}.png`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            window.URL.revokeObjectURL(url)
                          } catch (error) {
                            console.error('Erro ao baixar imagem:', error)
                            toast.error('Erro ao baixar imagem. Tente novamente.')
                          }
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      >
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 text-center">
                      {index === 0 ? 'Capa' : `Slide ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isGeneratingImages && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin">
                <Loader2 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Gerando Imagens</h3>
                <p className="text-sm text-muted-foreground">
                  Estamos criando seu carrossel. Isso pode levar alguns segundos...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
