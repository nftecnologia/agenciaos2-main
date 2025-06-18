'use client'

import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, StopCircle, X, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[], audioBlob?: Blob) => void
  disabled?: boolean
  placeholder?: string
}

interface AttachedFile {
  file: File
  id: string
  preview?: string
}

const quickSuggestions = [
  "Explique como funciona...",
  "Crie uma lista de...",
  "Qual a diferença entre...",
  "Como posso melhorar...",
  "Dê exemplos de...",
  "Resuma o conceito de..."
]

export function MessageInput({ onSendMessage, disabled = false, placeholder = "Digite sua mensagem..." }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Limpeza dos efeitos
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handleSubmit = () => {
    if ((message.trim() || attachedFiles.length > 0 || audioBlob) && !disabled) {
      const files = attachedFiles.map(af => af.file)
      onSendMessage(message, files.length > 0 ? files : undefined, audioBlob || undefined)
      setMessage('')
      setAttachedFiles([])
      setAudioBlob(null)
      setShowSuggestions(false)
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      // Verificar tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo "${file.name}" é muito grande. Máximo 10MB.`)
        return
      }

      const newFile: AttachedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }

      setAttachedFiles(prev => [...prev, newFile])
    })

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Contador de tempo
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
      alert('Erro ao acessar o microfone. Verifique as permissões.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setRecordingTime(0)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const removeAudio = () => {
    setAudioBlob(null)
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    const maxHeight = 120 // max-h-[120px]
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (!message.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const characterCount = message.length
  const maxCharacters = 2000

  return (
    <div className="space-y-3">
      {/* Quick suggestions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 px-1">
          <span className="text-xs text-gray-500 font-medium mb-1">Sugestões rápidas:</span>
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Attached files preview */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachedFiles.map((file) => (
            <div key={file.id} className="relative group">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 pr-8">
                {file.preview ? (
                  <Image 
                    src={file.preview} 
                    alt={file.file.name} 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded object-cover" 
                  />
                ) : (
                  <FileIcon className="w-4 h-4 text-gray-500" />
                )}
                <div className="text-xs">
                  <div className="font-medium truncate max-w-[100px]">{file.file.name}</div>
                  <div className="text-gray-500">{Math.round(file.file.size / 1024)}KB</div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 w-6 h-6 p-0 bg-red-100 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.id)}
              >
                <X className="w-3 h-3 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Audio preview */}
      {audioBlob && (
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Áudio gravado</span>
            <span className="text-sm text-blue-600">{formatTime(recordingTime)}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-red-600 hover:bg-red-100"
            onClick={removeAudio}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center justify-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-700">Gravando...</span>
            <span className="text-sm text-red-600 font-mono">{formatTime(recordingTime)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancelRecording}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <StopCircle className="w-4 h-4 mr-1" />
              Parar
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="relative">
        <div className={cn(
          "flex gap-3 items-end p-3 bg-white border rounded-lg transition-all duration-200",
          isFocused 
            ? "border-blue-300 shadow-md ring-1 ring-blue-100" 
            : "border-gray-200 hover:border-gray-300"
        )}>
          {/* Textarea container */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled || isRecording}
              className="min-h-[44px] max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-sm leading-relaxed"
              rows={1}
            />
            
            {/* Character counter */}
            {characterCount > 0 && (
              <div className={cn(
                "absolute bottom-0 right-0 text-xs transition-colors duration-200",
                characterCount > maxCharacters * 0.8 
                  ? characterCount > maxCharacters 
                    ? "text-red-500" 
                    : "text-orange-500"
                  : "text-gray-400"
              )}>
                {characterCount}/{maxCharacters}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Attachment button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,text/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "w-8 h-8 p-0 transition-colors duration-200",
                attachedFiles.length > 0 
                  ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
              disabled={disabled || isRecording}
              onClick={() => fileInputRef.current?.click()}
              title="Anexar arquivo"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Voice input button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "w-8 h-8 p-0 transition-colors duration-200",
                isRecording || audioBlob
                  ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
              disabled={disabled}
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Parar gravação" : "Gravar áudio"}
            >
              {isRecording ? (
                <StopCircle className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* Send button */}
            <Button
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && attachedFiles.length === 0 && !audioBlob) || characterCount > maxCharacters || isRecording}
              size="sm"
              className={cn(
                "w-8 h-8 p-0 transition-all duration-200",
                (message.trim() || attachedFiles.length > 0 || audioBlob) && !disabled && !isRecording
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-gray-500">
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> para enviar, 
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift+Enter</kbd> para nova linha
          </p>
          
          {disabled && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              IA respondendo...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
