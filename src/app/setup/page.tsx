'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function SetupPage() {
  const [_isSetup, setIsSetup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  const runSetup = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      
      setResult(data)
      
      if (data.success) {
        setIsSetup(true)
        // Redirecionar após 3 segundos
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao conectar com a API',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Executar setup automaticamente quando a página carregar
    runSetup()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            AgênciaOS Setup
          </CardTitle>
          <p className="text-gray-600">
            Configurando o banco de dados...
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center space-x-2 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-lg">Configurando banco de dados...</span>
            </div>
          )}

          {result && !isLoading && (
            <div className="text-center py-4">
              {result.success ? (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">
                      Setup Concluído!
                    </h3>
                    <p className="text-gray-600 mt-2">{result.message}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Redirecionando em 3 segundos...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-700">
                      Erro no Setup
                    </h3>
                    <p className="text-gray-600 mt-2">{result.message}</p>
                    {result.error && (
                      <p className="text-sm text-red-500 mt-2">
                        {result.error}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={runSetup}
                    className="w-full"
                    variant="outline"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </div>
          )}

          {!isLoading && !result && (
            <div className="text-center py-8">
              <Button 
                onClick={runSetup}
                className="w-full"
                size="lg"
              >
                Iniciar Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}