import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface TenantContext {
  user: {
    id: string
    email: string
    name?: string | null
    role: string
    agencyId: string | null
  }
  agencyId: string
}

export async function requireTenant(): Promise<TenantContext> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Acesso negado: usuário não autenticado')
  }

  if (!session.user.agencyId) {
    throw new Error('Acesso negado: usuário não vinculado a uma agência')
  }

  // Verificar se o usuário e agência ainda existem
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      agency: true,
    },
  })

  if (!user || !user.agency) {
    throw new Error('Acesso negado: usuário ou agência não encontrada')
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agencyId: user.agencyId!,
    },
    agencyId: user.agencyId!,
  }
}