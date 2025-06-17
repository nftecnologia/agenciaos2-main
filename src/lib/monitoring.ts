// Sistema de monitoramento de performance e erros
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private errors: Array<{ timestamp: Date; error: Error; context?: string }> = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Medir performance de operações
  measure<T>(name: string, operation: () => Promise<T>, context?: string): Promise<T> {
    const start = performance.now()
    
    return operation()
      .then((result) => {
        const duration = performance.now() - start
        this.addMetric(name, duration)
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 ${name}: ${duration.toFixed(2)}ms`)
        }
        
        return result
      })
      .catch((error) => {
        const duration = performance.now() - start
        this.addMetric(name, duration)
        this.addError(error, context || name)
        throw error
      })
  }

  // Adicionar métrica
  private addMetric(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(duration)
    
    // Manter apenas as últimas 100 medições
    if (values.length > 100) {
      values.shift()
    }
  }

  // Adicionar erro
  private addError(error: Error, context?: string) {
    this.errors.push({
      timestamp: new Date(),
      error,
      context
    })
    
    // Manter apenas os últimos 50 erros
    if (this.errors.length > 50) {
      this.errors.shift()
    }
  }

  // Obter estatísticas de performance
  getMetrics(name: string) {
    const values = this.metrics.get(name) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)

    return {
      count: values.length,
      average: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    }
  }

  // Obter erros recentes
  getRecentErrors(limit = 10) {
    return this.errors
      .slice(-limit)
      .reverse()
      .map(({ timestamp, error, context }) => ({
        timestamp,
        message: error.message,
        stack: error.stack,
        context
      }))
  }

  // Limpar dados
  clear() {
    this.metrics.clear()
    this.errors.length = 0
  }

  // Exportar relatório
  generateReport() {
    const allMetrics: Record<string, ReturnType<typeof this.getMetrics>> = {}
    
    for (const [name] of this.metrics) {
      allMetrics[name] = this.getMetrics(name)
    }

    return {
      timestamp: new Date(),
      metrics: allMetrics,
      recentErrors: this.getRecentErrors(20),
      summary: {
        totalMetrics: this.metrics.size,
        totalErrors: this.errors.length
      }
    }
  }
}

// Instância global
export const monitor = PerformanceMonitor.getInstance()

// Helper para medir performance de hooks
export function usePerformanceMonitor() {
  return {
    measure: monitor.measure.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getRecentErrors: monitor.getRecentErrors.bind(monitor)
  }
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const metric = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean; processingStart?: number }
      
      switch (metric.entryType) {
        case 'largest-contentful-paint':
          if (process.env.NODE_ENV === 'development') {
            console.log(`📈 LCP: ${metric.startTime.toFixed(2)}ms`)
          }
          break
        case 'first-input':
          if (process.env.NODE_ENV === 'development' && metric.processingStart) {
            console.log(`📈 FID: ${metric.processingStart - metric.startTime}ms`)
          }
          break
        case 'layout-shift':
          if (!metric.hadRecentInput && process.env.NODE_ENV === 'development') {
            console.log(`📈 CLS: ${metric.value}`)
          }
          break
      }
    }
  })

  // Observar Core Web Vitals
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  } catch {
    // Browser não suporta algumas métricas
    if (process.env.NODE_ENV === 'development') {
      console.warn('Algumas métricas Web Vitals não são suportadas neste browser')
    }
  }
}