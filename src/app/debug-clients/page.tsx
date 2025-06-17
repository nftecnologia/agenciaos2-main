import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function DebugClientsPage() {
  const session = await auth()
  
  if (!session?.user?.agencyId) {
    redirect('/auth/signin')
  }

  try {
    // Buscar clientes diretamente do banco
    const clients = await db.client.findMany({
      where: {
        agencyId: session.user.agencyId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug - Clientes</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Informações da Sessão:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm">
              {JSON.stringify({
                userId: session.user.id,
                userEmail: session.user.email,
                agencyId: session.user.agencyId,
                role: session.user.role
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Clientes Encontrados ({clients.length}):</h2>
            {clients.length > 0 ? (
              <div className="space-y-2">
                {clients.map((client) => (
                  <div key={client.id} className="bg-gray-100 p-4 rounded">
                    <p><strong>ID:</strong> {client.id}</p>
                    <p><strong>Nome:</strong> {client.name}</p>
                    <p><strong>Email:</strong> {client.email || 'N/A'}</p>
                    <p><strong>Empresa:</strong> {client.company || 'N/A'}</p>
                    <p><strong>AgencyId:</strong> {client.agencyId}</p>
                    <p><strong>Criado em:</strong> {client.createdAt.toISOString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum cliente encontrado para esta agência.</p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Erro no Debug</h1>
        <div className="bg-red-100 p-4 rounded">
          <pre>{error instanceof Error ? error.message : 'Erro desconhecido'}</pre>
        </div>
      </div>
    )
  }
}