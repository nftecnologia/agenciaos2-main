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

      console.log('🔍 [useClientsList] Iniciando busca de clientes...')
      
      // Buscar todos os clientes sem paginação
      const url = '/api/clients?limit=1000'
      console.log('📡 [useClientsList] URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies de sessão
      })
      
      console.log('📊 [useClientsList] Response status:', response.status)
      console.log('📊 [useClientsList] Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [useClientsList] Response error text:', errorText)
        
        let errorMessage = 'Erro ao carregar clientes'
        
        try {
          const errorData = JSON.parse(errorText)
          console.error('❌ [useClientsList] Parsed error data:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('📋 [useClientsList] Response data:', data)
      
      // Verificar se a resposta tem a estrutura esperada
      if (!data || !Array.isArray(data.clients)) {
        console.warn('⚠️ [useClientsList] Estrutura de resposta inesperada:', data)
        setClients([])
        return
      }
      
      console.log(`✅ [useClientsList] ${data.clients.length} clientes encontrados`)
      
      const mappedClients = data.clients.map((client: { id: string; name: string; company?: string }) => ({
        id: client.id,
        name: client.name,
        company: client.company,
      }))
      
      console.log('🗺️ [useClientsList] Clientes mapeados:', mappedClients)
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
