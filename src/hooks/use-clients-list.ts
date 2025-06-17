'use client'

import { useState, useEffect } from 'react'

export interface ClientOption {
  id: string
  name: string
  company?: string
}

export function useClientsList() {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar todos os clientes sem paginação
      const response = await fetch('/api/clients?limit=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies de sessão
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Erro ao carregar clientes'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Verificar se a resposta tem a estrutura esperada
      if (!data || !Array.isArray(data.clients)) {
        console.warn('Estrutura de resposta inesperada:', data)
        setClients([])
        return
      }
      
      const mappedClients = data.clients.map((client: { id: string; name: string; company?: string }) => ({
        id: client.id,
        name: client.name,
        company: client.company,
      }))
      
      setClients(mappedClients)
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setClients([]) // Garantir que lista fica vazia em caso de erro
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const refreshClients = () => {
    fetchClients()
  }

  return {
    clients,
    loading,
    error,
    refreshClients,
  }
}
