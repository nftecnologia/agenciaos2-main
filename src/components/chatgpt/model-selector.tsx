'use client'

import { ChevronDown, Cpu, Zap, Brain, Sparkles, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChatModel } from './chat-interface'

interface ModelSelectorProps {
  models: ChatModel[]
  selectedModel: ChatModel
  onModelChange: (model: ChatModel) => void
}

const getModelIcon = (modelId: string) => {
  if (modelId.includes('gpt-4o')) return <Sparkles className="w-4 h-4" />
  if (modelId.includes('gpt-4-turbo')) return <Rocket className="w-4 h-4" />
  if (modelId.includes('gpt-4')) return <Brain className="w-4 h-4" />
  if (modelId.includes('gpt-3.5')) return <Zap className="w-4 h-4" />
  return <Cpu className="w-4 h-4" />
}

const getModelBadge = (modelId: string) => {
  if (modelId.includes('gpt-4o')) return { text: 'Novo', color: 'bg-green-100 text-green-700' }
  if (modelId.includes('turbo')) return { text: 'Rápido', color: 'bg-blue-100 text-blue-700' }
  if (modelId.includes('32k') || modelId.includes('16k')) return { text: 'Contexto+', color: 'bg-purple-100 text-purple-700' }
  if (modelId.includes('preview')) return { text: 'Preview', color: 'bg-orange-100 text-orange-700' }
  return null
}

const groupModels = (models: ChatModel[]) => {
  const gpt4o = models.filter(m => m.id.includes('gpt-4o'))
  const gpt4 = models.filter(m => m.id.includes('gpt-4') && !m.id.includes('gpt-4o'))
  const gpt35 = models.filter(m => m.id.includes('gpt-3.5'))
  
  return { gpt4o, gpt4, gpt35 }
}

export function ModelSelector({ models, selectedModel, onModelChange }: ModelSelectorProps) {
  const { gpt4o, gpt4, gpt35 } = groupModels(models)
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {getModelIcon(selectedModel.id)}
        <div>
          <p className="text-sm font-medium text-gray-700">Modelo ativo:</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[280px] h-auto py-2">
                <div className="text-left flex items-center gap-2">
                  {getModelIcon(selectedModel.id)}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {selectedModel.name}
                      {getModelBadge(selectedModel.id) && (
                        <Badge className={`text-xs px-1.5 py-0.5 ${getModelBadge(selectedModel.id)?.color}`}>
                          {getModelBadge(selectedModel.id)?.text}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {selectedModel.description}
                    </div>
                  </div>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[400px]">
              {/* GPT-4o Models */}
              {gpt4o.length > 0 && (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-green-700">
                    <Sparkles className="w-4 h-4" />
                    GPT-4o (Mais Recente)
                  </DropdownMenuLabel>
                  {gpt4o.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => onModelChange(model)}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {getModelIcon(model.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {getModelBadge(model.id) && (
                              <Badge className={`text-xs px-1.5 py-0.5 ${getModelBadge(model.id)?.color}`}>
                                {getModelBadge(model.id)?.text}
                              </Badge>
                            )}
                          </div>
                          {model.id === selectedModel.id && (
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 block">
                          {model.description}
                        </span>
                        <span className="text-xs text-gray-400">
                          Máx. {model.maxTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              {/* GPT-4 Models */}
              {gpt4.length > 0 && (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-blue-700">
                    <Brain className="w-4 h-4" />
                    GPT-4 (Avançado)
                  </DropdownMenuLabel>
                  {gpt4.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => onModelChange(model)}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {getModelIcon(model.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {getModelBadge(model.id) && (
                              <Badge className={`text-xs px-1.5 py-0.5 ${getModelBadge(model.id)?.color}`}>
                                {getModelBadge(model.id)?.text}
                              </Badge>
                            )}
                          </div>
                          {model.id === selectedModel.id && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 block">
                          {model.description}
                        </span>
                        <span className="text-xs text-gray-400">
                          Máx. {model.maxTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              {/* GPT-3.5 Models */}
              {gpt35.length > 0 && (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-yellow-700">
                    <Zap className="w-4 h-4" />
                    GPT-3.5 (Rápido)
                  </DropdownMenuLabel>
                  {gpt35.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => onModelChange(model)}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {getModelIcon(model.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {getModelBadge(model.id) && (
                              <Badge className={`text-xs px-1.5 py-0.5 ${getModelBadge(model.id)?.color}`}>
                                {getModelBadge(model.id)?.text}
                              </Badge>
                            )}
                          </div>
                          {model.id === selectedModel.id && (
                            <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 block">
                          {model.description}
                        </span>
                        <span className="text-xs text-gray-400">
                          Máx. {model.maxTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
