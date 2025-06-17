'use client'

import { useState } from 'react'
import { useClients, type CreateClientData } from '@/hooks/use-clients'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface CreateClientDialogProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
}

export function CreateClientDialog({ open, onOpenChangeAction }: CreateClientDialogProps) {
  const [formData, setFormData] = useState<CreateClientData>({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { createClient } = useClients()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Preparar dados limpos
      const cleanData: CreateClientData = {
        name: formData.name.trim(),
        email: formData.email && formData.email.trim() !== '' ? formData.email.trim() : undefined,
        phone: formData.phone && formData.phone.trim() !== '' ? formData.phone.trim() : undefined,
        company: formData.company && formData.company.trim() !== '' ? formData.company.trim() : undefined,
      }

      console.log('Enviando dados do cliente:', cleanData)
      await createClient(cleanData)
      
      // Resetar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
      })
      
      onOpenChangeAction(false)
    } catch (err) {
      console.error('Erro ao criar cliente:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro inesperado ao criar cliente. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateClientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Adicione um novo cliente à sua agência. Preencha as informações básicas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>



          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
