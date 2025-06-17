import React, { lazy } from 'react'

// Lazy loading para componentes IA - Note: Requires default exports
export const createLazyComponent = (importPath: string) => 
  lazy(() => import(importPath))

// Utility para lazy loading de agentes específicos quando necessário
export const lazyLoadAgent = (agentName: string) => {
  return lazy(() => import(`@/components/ia/agents/${agentName}`))
}

// Performance monitoring
export const trackPerformance = (name: string, fn: () => Promise<unknown>) => {
  return async () => {
    const start = performance.now()
    try {
      const result = await fn()
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