'use client'

import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, Target, PenTool, TestTube, Megaphone } from 'lucide-react'
import { PersonaGenerator } from './persona-generator'
import { AudienceSegmentation } from './audience-segmentation'
import { CopyGenerator } from './copy-generator'
import { ABTestingPlanner } from './ab-testing'

export function MetaAdsAssistants() {
  const [activeTab, setActiveTab] = useState('persona')

  const assistants = [
    {
      id: 'persona',
      name: 'Gerador de Persona',
      description: 'Crie personas detalhadas para suas campanhas',
      icon: User,
      component: PersonaGenerator,
      badge: 'Popular'
    },
    {
      id: 'segmentation',
      name: 'Segmentação de Público',
      description: 'Defina públicos precisos para Meta Ads',
      icon: Target,
      component: AudienceSegmentation,
      badge: 'Essencial'
    },
    {
      id: 'copy',
      name: 'Gerador de Copies',
      description: 'Copies persuasivas em segundos',
      icon: PenTool,
      component: CopyGenerator,
      badge: 'Alta Conversão'
    },
    {
      id: 'testing',
      name: 'Testes A/B',
      description: 'Planeje testes eficientes',
      icon: TestTube,
      component: ABTestingPlanner,
      badge: 'Pro'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
          <Megaphone className="h-4 w-4" />
          Assistentes Meta Ads
        </div>
        <h2 className="text-3xl font-bold">
          Ferramentas IA para <span className="text-blue-600">Meta Ads</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assistentes especializados para criar campanhas de alta performance no Facebook e Instagram Ads
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
                activeTab === assistant.id ? 'ring-2 ring-blue-600' : ''
              }`}
              onClick={() => setActiveTab(assistant.id)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    activeTab === assistant.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeTab === assistant.id ? 'text-blue-600' : 'text-gray-600'
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
