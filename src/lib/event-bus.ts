// Event Bus para sincronização de dados entre hooks
class EventBus {
  private events: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(data))
  }
}

export const eventBus = new EventBus()

// Eventos específicos para o AgênciaOS
export const EVENTS = {
  CLIENT_CREATED: 'client:created',
  CLIENT_UPDATED: 'client:updated',
  CLIENT_DELETED: 'client:deleted',
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',
  REFRESH_ALL: 'refresh:all'
} as const