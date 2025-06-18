'use client'

import { PageHeader } from '@/components/layout/page-header'
import { IACentralDashboard } from '@/components/ia/ia-central-dashboard'
import { InstagramCarouselGenerator } from '@/components/ia/instagram-carousel-generator'
import { MetaAdsAssistants } from '@/components/ia/agents/meta-ads-assistants'
import { YoutubeAssistants } from '@/components/ia/agents/youtube-assistants'
import { InstagramAssistants } from '@/components/ia/agents/instagram-assistants'
import { BlogAssistants } from '@/components/ia/agents/blog-assistants'
import { WhatsappAssistants } from '@/components/ia/agents/whatsapp-assistants'
import { FunnelAssistants } from '@/components/ia/agents/funnel-assistants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function IAPage() {
  return (
    <>
      <PageHeader
        title="Agentes"
        description="Ferramentas de inteligência artificial para otimizar sua agência"
      />
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard IA</TabsTrigger>
          <TabsTrigger value="meta-ads">Meta Ads</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="instagram-tools">Instagram Tools</TabsTrigger>
          <TabsTrigger value="instagram">Gerador de Carrossel</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Vendas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <IACentralDashboard />
        </TabsContent>
        
        <TabsContent value="meta-ads">
          <MetaAdsAssistants />
        </TabsContent>
        
        <TabsContent value="youtube">
          <YoutubeAssistants />
        </TabsContent>
        
        <TabsContent value="instagram-tools">
          <InstagramAssistants />
        </TabsContent>
        
        <TabsContent value="instagram">
          <InstagramCarouselGenerator />
        </TabsContent>
        
        <TabsContent value="blog">
          <BlogAssistants />
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsappAssistants />
        </TabsContent>
        
        <TabsContent value="funnel">
          <FunnelAssistants />
        </TabsContent>
      </Tabs>
    </>
  )
}
