'use client'

import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Edit3, Lightbulb, Layout, Hash, Instagram } from 'lucide-react'
import { InstagramCaptionGenerator } from './instagram-caption-generator'
import { InstagramPostIdeas } from './instagram-post-ideas'
import { InstagramCarouselText } from './instagram-carousel-text'
import { InstagramHashtags } from './instagram-hashtags'

export function InstagramAssistants() {
  const [activeTab, setActiveTab] = useState('caption')

  const assistants = [
    {
      id: 'caption',
      name: 'Gerador de Legendas',
      description: 'Crie legendas engajadoras',
      icon: Edit3,
      component: InstagramCaptionGenerator,
      badge: 'Popular'
    },
    {
      id: 'ideas',
      name: 'Ideias de Posts',
      description: 'Nunca fique sem conteúdo',
      icon: Lightbulb,
      component: InstagramPostIdeas,
      badge: 'Criativo'
    },
    {
      id: 'carousel',
      name: 'Carrossel Textual',
      description: 'Carrosséis que convertem',
      icon: Layout,
      component: InstagramCarouselText,
      badge: 'Alta Conversão'
    },
    {
      id: 'hashtags',
      name: 'Hashtags Estratégicas',
      description: 'Maximize seu alcance',
      icon: Hash,
      component: InstagramHashtags,
      badge: 'SEO'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium">
          <Instagram className="h-4 w-4" />
          Assistentes Instagram
        </div>
        <h2 className="text-3xl font-bold">
          Ferramentas IA para <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instagram</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assistentes especializados para criar conteúdo viral e aumentar seu engajamento no Instagram
        </p>
      </div>

      {/* Assistant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assistants.map((assistant) => {
          const Icon = assistant.icon
          return (
            <Card 
              key={assistant.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === assistant.id ? 'ring-2 ring-purple-600' : ''
              }`}
              onClick={() => setActiveTab(assistant.id)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    activeTab === assistant.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeTab === assistant.id ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {assistant.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{assistant.name}</CardTitle>
                <CardDescription className="text-sm">
                  {assistant.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="hidden">
          {assistants.map((assistant) => (
            <TabsTrigger key={assistant.id} value={assistant.id}>
              {assistant.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {assistants.map((assistant) => {
          const Component = assistant.component
          return (
            <TabsContent key={assistant.id} value={assistant.id}>
              <Component />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
