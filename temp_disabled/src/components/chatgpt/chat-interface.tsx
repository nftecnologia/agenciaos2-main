'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModelSelector } from './model-selector'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { 
  Trash2, 
  Download, 
  MessageSquare,
  Sparkles,
  Zap
} from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  assistantType?: string
}

export interface ChatModel {
  id: string
  name: string
  description: string
  maxTokens: number
}

export interface AssistantType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  systemPrompt: string
}

const availableModels: ChatModel[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Rápido e eficiente para tarefas gerais',
    maxTokens: 4096
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 Turbo 16K',
    description: 'GPT-3.5 com contexto estendido para 16K tokens',
    maxTokens: 16384
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Mais avançado e preciso, ideal para tarefas complexas',
    maxTokens: 8192
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 32K',
    description: 'GPT-4 com contexto estendido para 32K tokens',
    maxTokens: 32768
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Versão mais rápida do GPT-4 com contexto estendido',
    maxTokens: 128000
  },
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo Preview',
    description: 'Versão prévia do GPT-4 Turbo com melhorias',
    maxTokens: 128000
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Modelo mais recente com capacidades multimodais',
    maxTokens: 128000
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Versão compacta e rápida do GPT-4o',
    maxTokens: 128000
  },
  {
    id: 'gpt-4-1106-preview',
    name: 'GPT-4 1106 Preview',
    description: 'GPT-4 com melhorias e dados até abril 2024',
    maxTokens: 128000
  },
  {
    id: 'gpt-4-0125-preview',
    name: 'GPT-4 0125 Preview',
    description: 'GPT-4 otimizado para reduzir casos de "preguiça"',
    maxTokens: 128000
  }
]

// Usar apenas um assistente padrão
const defaultAssistant: AssistantType = {
  id: 'chat-ia',
  name: '🤖 Chat IA',
  description: 'Assistente geral para conversas e perguntas diversas',
  icon: '🤖',
  color: 'bg-blue-500',
  systemPrompt: 'Você é um assistente de IA útil e amigável. Responda de forma clara e precisa às perguntas do usuário.'
}

export function ChatInterface() {
  const [selectedAssistant] = useState<AssistantType>(defaultAssistant)
  const [messagesByAssistant, setMessagesByAssistant] = useState<Record<string, Message[]>>({})
  const [selectedModel, setSelectedModel] = useState<ChatModel>(availableModels[0])
  const [isLoading, setIsLoading] = useState(false)

  // Obter mensagens do assistente atual
  const messages = messagesByAssistant[selectedAssistant.id] || []

  const handleSendMessage = async (content: string, attachments?: File[], audioBlob?: Blob) => {
    if ((!content.trim() && !attachments?.length && !audioBlob) || isLoading) return

    // Preparar conteúdo da mensagem
    let messageContent = content

    // Adicionar informações sobre anexos
    if (attachments?.length) {
      messageContent += `\n\n📎 Arquivos anexados: ${attachments.map(f => f.name).join(', ')}`
    }

    // Adicionar informação sobre áudio
    if (audioBlob) {
      messageContent += '\n\n🎤 Áudio gravado enviado'
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    // Atualizar mensagens do assistente atual
    setMessagesByAssistant(prev => ({
      ...prev,
      [selectedAssistant.id]: [...(prev[selectedAssistant.id] || []), userMessage]
    }))
    setIsLoading(true)

    try {
      // Por enquanto, vamos enviar apenas o texto
      // TODO: Implementar upload de arquivos e transcrição de áudio
      let finalContent = content

      // Se há áudio, simular transcrição
      if (audioBlob) {
        finalContent += '\n\n[Nota: Funcionalidade de transcrição de áudio será implementada em breve]'
      }

      // Se há anexos, simular processamento
      if (attachments?.length) {
        finalContent += `\n\n[Nota: Processamento de arquivos será implementado em breve. Arquivos: ${attachments.map(f => f.name).join(', ')}]`
      }

      // Incluir o prompt do sistema do assistente
      const systemMessage = { role: 'system' as const, content: selectedAssistant.systemPrompt }
      const conversationMessages = [systemMessage, ...messages, { role: 'user' as const, content: finalContent }]

      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel.id
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        assistantType: selectedAssistant.id
      }

      setMessagesByAssistant(prev => ({
        ...prev,
        [selectedAssistant.id]: [...(prev[selectedAssistant.id] || []), assistantMessage]
      }))
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
        assistantType: selectedAssistant.id
      }

      setMessagesByAssistant(prev => ({
        ...prev,
        [selectedAssistant.id]: [...(prev[selectedAssistant.id] || []), errorMessage]
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessagesByAssistant(prev => ({
      ...prev,
      [selectedAssistant.id]: []
    }))
  }

  const exportChat = () => {
    const chatData = {
      model: selectedModel.name,
      timestamp: new Date().toLocaleString('pt-BR'),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toLocaleString('pt-BR')
      }))
    }
    
    const dataStr = JSON.stringify(chatData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-${selectedModel.id}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getMessageStats = () => {
    const userMessages = messages.filter(m => m.role === 'user').length
    const assistantMessages = messages.filter(m => m.role === 'assistant').length
    const totalTokensEstimate = messages.reduce((acc, msg) => acc + Math.ceil(msg.content.length / 4), 0)
    return { userMessages, assistantMessages, totalTokensEstimate }
  }

  const { userMessages, assistantMessages, totalTokensEstimate } = getMessageStats()

  return (
    <div className="flex flex-col h-full">
      {/* Header aprimorado */}
      <div className="space-y-4 mb-4">
        {/* Seletor de modelo */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportChat}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearMessages}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Estatísticas da conversa */}
        {messages.length > 0 && (
          <Card className="p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-green-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>{userMessages} perguntas</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  <span>{assistantMessages} respostas</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <Zap className="w-4 h-4" />
                  <span>~{totalTokensEstimate.toLocaleString()} tokens</span>
                </div>
              </div>
              
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700"
              >
                {selectedModel.name}
              </Badge>
            </div>
          </Card>
        )}
      </div>

      {/* Área de mensagens */}
      <Card className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        
        <div className="border-t p-4">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Digite sua mensagem..."
          />
        </div>
      </Card>
    </div>
  )
}
