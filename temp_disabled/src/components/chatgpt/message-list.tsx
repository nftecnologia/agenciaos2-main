'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User, Bot, Copy, Check, MessageSquare } from 'lucide-react'
import { Message } from './chat-interface'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

function MessageItem({ message }: { message: Message }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div
      className={cn(
        "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
          <AvatarFallback>
            <Bot className="w-4 h-4 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="relative group max-w-[70%]">
        <div
          className={cn(
            "rounded-lg px-4 py-3 shadow-sm transition-all duration-200",
            message.role === 'user'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
              : 'bg-white border border-gray-200 text-gray-900 hover:shadow-md'
          )}
        >
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          <div
            className={cn(
              "flex items-center justify-between mt-2 text-xs",
              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
            )}
          >
            <span>
              {message.timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {(isHovered || copiedId === message.id) && (
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "h-6 w-6 p-0 transition-all duration-200",
                  message.role === 'user' 
                    ? 'hover:bg-blue-500 text-blue-100 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                )}
                onClick={() => copyToClipboard(message.content, message.id)}
              >
                {copiedId === message.id ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {message.role === 'user' && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300">
          <AvatarFallback>
            <User className="w-4 h-4 text-gray-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Olá! Como posso ajudar?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Faça qualquer pergunta ou inicie uma conversa. Posso ajudar com:
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
              💡 Ideias e brainstorming
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-green-800">
              📝 Redação e edição
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-purple-800">
              🧠 Resolução de problemas
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-orange-800">
              💼 Tarefas profissionais
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 duration-300">
          <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200">
            <AvatarFallback>
              <Bot className="w-4 h-4 text-blue-600" />
            </AvatarFallback>
          </Avatar>
          
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">Escrevendo...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}
