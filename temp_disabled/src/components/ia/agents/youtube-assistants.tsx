'use client'

import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Video, Tag, Calendar, RefreshCw, Youtube } from 'lucide-react'
import { YoutubeScriptGenerator } from './youtube-script-generator'
import { YoutubeSeoGenerator } from './youtube-seo-generator'
import { YoutubeContentPlanner } from './youtube-content-planner'
import { YoutubeOptimization } from './youtube-optimization'

export function YoutubeAssistants() {
  const [activeTab, setActiveTab] = useState('script')

  const assistants = [
    {
      id: 'script',
      name: 'Gerador de Roteiro',
      description: 'Crie roteiros profissionais para vídeos',
      icon: Video,
      component: YoutubeScriptGenerator,
      badge: 'Essencial'
    },
    {
      id: 'seo',
      name: 'SEO para YouTube',
      description: 'Títulos, descrições e tags otimizadas',
      icon: Tag,
      component: YoutubeSeoGenerator,
      badge: 'Alta Conversão'
    },
    {
      id: 'planner',
      name: 'Planejador de Conteúdo',
      description: 'Calendário editorial completo',
      icon: Calendar,
      component: YoutubeContentPlanner,
      badge: 'Estratégico'
    },
    {
      id: 'optimization',
      name: 'Otimização de Vídeos',
      description: 'Recupere vídeos antigos',
      icon: RefreshCw,
      component: YoutubeOptimization,
      badge: 'Recovery'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium">
          <Youtube className="h-4 w-4" />
          Assistentes YouTube
        </div>
        <h2 className="text-3xl font-bold">
          Ferramentas IA para <span className="text-red-600">YouTube</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assistentes especializados para criar conteúdo viral e otimizar seu canal no YouTube
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
                activeTab === assistant.id ? 'ring-2 ring-red-600' : ''
              }`}
              onClick={() => setActiveTab(assistant.id)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    activeTab === assistant.id ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeTab === assistant.id ? 'text-red-600' : 'text-gray-600'
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
