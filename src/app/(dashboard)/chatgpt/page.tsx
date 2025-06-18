'use client'

import { PageHeader } from '@/components/layout/page-header'
import { ChatInterface } from '@/components/chatgpt/chat-interface'

export default function ChatGPTPage() {
  return (
    <>
      <PageHeader
        title="ChatGPT"
        description="Converse com diferentes modelos de inteligência artificial"
      />
      
      <div className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
        <ChatInterface />
      </div>
    </>
  )
}
