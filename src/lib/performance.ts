import { lazy } from 'react'

// Lazy loading dos agentes IA para melhor performance
export const lazyAgents = {
  // Meta Ads Agents
  ABTesting: lazy(() => import('@/components/ia/agents/ab-testing')),
  AudienceSegmentation: lazy(() => import('@/components/ia/agents/audience-segmentation')),
  PersonaGenerator: lazy(() => import('@/components/ia/agents/persona-generator')),
  CopyGenerator: lazy(() => import('@/components/ia/agents/copy-generator')),
  
  // Instagram Agents  
  InstagramCaption: lazy(() => import('@/components/ia/agents/instagram-caption-generator')),
  InstagramHashtags: lazy(() => import('@/components/ia/agents/instagram-hashtags')),
  InstagramPostIdeas: lazy(() => import('@/components/ia/agents/instagram-post-ideas')),
  InstagramCarouselText: lazy(() => import('@/components/ia/agents/instagram-carousel-text')),
  
  // Blog/SEO Agents
  BlogComplete: lazy(() => import('@/components/ia/agents/blog-complete-writer')),
  BlogIdeas: lazy(() => import('@/components/ia/agents/blog-ideas-generator')),
  BlogStructure: lazy(() => import('@/components/ia/agents/blog-structure-generator')),
  BlogSEO: lazy(() => import('@/components/ia/agents/blog-seo-optimizer')),
  BlogFAQ: lazy(() => import('@/components/ia/agents/blog-faq-generator')),
  BlogMeta: lazy(() => import('@/components/ia/agents/blog-meta-generator')),
  
  // YouTube Agents
  YouTubeScript: lazy(() => import('@/components/ia/agents/youtube-script-generator')),
  YouTubeSEO: lazy(() => import('@/components/ia/agents/youtube-seo-generator')),
  YouTubeContentPlanner: lazy(() => import('@/components/ia/agents/youtube-content-planner')),
  YouTubeOptimization: lazy(() => import('@/components/ia/agents/youtube-optimization')),
  
  // WhatsApp Agents
  WhatsAppSalesScript: lazy(() => import('@/components/ia/agents/whatsapp-sales-script-generator')),
  WhatsAppTemplates: lazy(() => import('@/components/ia/agents/whatsapp-templates-generator')),
  WhatsAppSupport: lazy(() => import('@/components/ia/agents/whatsapp-support-generator')),
  WhatsAppFollowup: lazy(() => import('@/components/ia/agents/whatsapp-followup-generator')),
  WhatsAppBroadcast: lazy(() => import('@/components/ia/agents/whatsapp-broadcast-generator')),
  WhatsAppAudioScript: lazy(() => import('@/components/ia/agents/whatsapp-audio-script-generator')),
  
  // Funnel Agents
  FunnelMainProduct: lazy(() => import('@/components/ia/agents/funnel-main-product-creator')),
  FunnelUpsell: lazy(() => import('@/components/ia/agents/funnel-upsell-turbo')),
  FunnelDownsell: lazy(() => import('@/components/ia/agents/funnel-downsell-recovery')),
  FunnelOrderBump: lazy(() => import('@/components/ia/agents/funnel-order-bump-express')),
}

// Performance monitoring
export const trackPerformance = (name: string, fn: () => Promise<unknown>) => {
  return async (...args: unknown[]) => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const end = performance.now()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name} executado em ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const end = performance.now()
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} falhou em ${(end - start).toFixed(2)}ms:`, error)
      }
      throw error
    }
  }
}

// Memoização para componentes pesados  
export const memoizeComponent = <T extends React.ComponentType<Record<string, unknown>>>(
  Component: T,
  areEqual?: (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>) => boolean
): T => {
  return React.memo(Component, areEqual) as T
}

// Debounce para inputs
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: unknown[]) => {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }) as T
}

// Throttle para scroll events
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean
  
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}