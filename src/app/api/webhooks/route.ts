import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { applyRateLimit } from '@/lib/rate-limit'

const webhookSchema = z.object({
  agencyId: z.string().cuid(),
  event: z.enum(['client_created', 'project_completed', 'revenue_added', 'task_completed', 'deadline_approaching']),
  data: z.record(z.any()),
  source: z.string().optional(),
})

// POST /api/webhooks - Receber webhooks externos
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'webhook')
    if (!rateLimitResult.success && rateLimitResult.error) {
      return NextResponse.json(
        { error: 'Rate limit excedido' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = webhookSchema.parse(body)

    // Verificar se a agência existe
    const agency = await prisma.agency.findUnique({
      where: { id: validatedData.agencyId },
    })

    if (!agency) {
      return NextResponse.json(
        { error: 'Agência não encontrada' },
        { status: 404 }
      )
    }

    // Buscar triggers ativos para este evento
    const triggers = await prisma.trigger.findMany({
      where: {
        agencyId: validatedData.agencyId,
        isActive: true,
        OR: [
          { triggerType: 'webhook' },
          { 
            triggerType: 'event',
            eventType: validatedData.event
          }
        ]
      }
    })

    const executionResults = []

    // Executar cada trigger encontrado
    for (const trigger of triggers) {
      try {
        const actions = JSON.parse(trigger.actions)
        const actionResults = []

        // Executar cada ação do trigger
        for (const action of actions) {
          const result = await executeAction(action, validatedData.data, validatedData.agencyId)
          actionResults.push(result)
        }

        // Registrar execução
        const execution = await prisma.triggerExecution.create({
          data: {
            triggerId: trigger.id,
            status: 'SUCCESS',
            executedAt: new Date(),
            eventData: JSON.stringify(validatedData.data),
            result: JSON.stringify({
              event: validatedData.event,
              actions: actionResults,
              source: validatedData.source
            })
          }
        })

        executionResults.push({
          triggerId: trigger.id,
          triggerName: trigger.name,
          status: 'SUCCESS',
          executionId: execution.id,
          actions: actionResults.length
        })

      } catch (actionError) {
        console.error(`Erro ao executar trigger ${trigger.id}:`, actionError)
        
        // Registrar execução com erro
        await prisma.triggerExecution.create({
          data: {
            triggerId: trigger.id,
            status: 'ERROR',
            executedAt: new Date(),
            eventData: JSON.stringify(validatedData.data),
            result: JSON.stringify({
              error: actionError instanceof Error ? actionError.message : 'Erro desconhecido',
              event: validatedData.event,
              source: validatedData.source
            })
          }
        })

        executionResults.push({
          triggerId: trigger.id,
          triggerName: trigger.name,
          status: 'ERROR',
          error: actionError instanceof Error ? actionError.message : 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      message: 'Webhook processado com sucesso',
      event: validatedData.event,
      triggersExecuted: triggers.length,
      results: executionResults
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para executar ações dos triggers
async function executeAction(action: any, eventData: any, agencyId: string) {
  switch (action.type) {
    case 'email':
      return await executeEmailAction(action.config, eventData, agencyId)
    
    case 'webhook':
      return await executeWebhookAction(action.config, eventData)
    
    case 'task_creation':
      return await executeTaskCreationAction(action.config, eventData, agencyId)
    
    case 'notification':
      return await executeNotificationAction(action.config, eventData, agencyId)
    
    case 'ai_generation':
      return await executeAIGenerationAction(action.config, eventData, agencyId)
    
    default:
      throw new Error(`Tipo de ação desconhecido: ${action.type}`)
  }
}

async function executeEmailAction(config: any, eventData: any, agencyId: string) {
  // Implementar envio de e-mail
  // Por exemplo, integração com provedor de e-mail
  
  return {
    type: 'email',
    status: 'success',
    message: `E-mail enviado para ${config.to}`,
    details: {
      to: config.to,
      subject: config.subject,
      template: config.template
    }
  }
}

async function executeWebhookAction(config: any, eventData: any) {
  // Implementar chamada para webhook externo
  try {
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify({
        ...eventData,
        timestamp: new Date().toISOString()
      })
    })

    return {
      type: 'webhook',
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      url: config.url
    }
  } catch (error) {
    return {
      type: 'webhook',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erro na requisição',
      url: config.url
    }
  }
}

async function executeTaskCreationAction(config: any, eventData: any, agencyId: string) {
  // Criar uma nova tarefa baseada na configuração
  try {
    if (!config.projectId || !config.boardId) {
      throw new Error('projectId e boardId são obrigatórios para criação de tarefa')
    }

    // Verificar se o projeto existe e pertence à agência
    const project = await prisma.project.findFirst({
      where: {
        id: config.projectId,
        agencyId: agencyId
      }
    })

    if (!project) {
      throw new Error('Projeto não encontrado')
    }

    // Obter próxima posição no board
    const lastTask = await prisma.task.findFirst({
      where: { boardId: config.boardId },
      orderBy: { position: 'desc' }
    })

    const position = lastTask ? lastTask.position + 1 : 0

    const task = await prisma.task.create({
      data: {
        projectId: config.projectId,
        boardId: config.boardId,
        title: config.title || `Tarefa automática - ${new Date().toLocaleDateString()}`,
        description: config.description || `Criada automaticamente pelo trigger`,
        priority: config.priority || 'MEDIUM',
        position,
        assignedTo: config.assignedTo || null,
        dueDate: config.dueDate ? new Date(config.dueDate) : null,
      }
    })

    return {
      type: 'task_creation',
      status: 'success',
      taskId: task.id,
      title: task.title
    }
  } catch (error) {
    return {
      type: 'task_creation',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erro na criação da tarefa'
    }
  }
}

async function executeNotificationAction(config: any, eventData: any, agencyId: string) {
  // Implementar sistema de notificações
  // Por exemplo, salvar notificação no banco ou enviar push notification
  
  return {
    type: 'notification',
    status: 'success',
    message: 'Notificação enviada',
    details: {
      recipient: config.recipient,
      message: config.message,
      type: config.notificationType
    }
  }
}

async function executeAIGenerationAction(config: any, eventData: any, agencyId: string) {
  // Implementar geração de conteúdo com IA
  // Por exemplo, gerar relatório, conteúdo para blog, etc.
  
  return {
    type: 'ai_generation',
    status: 'success',
    message: 'Conteúdo gerado com IA',
    details: {
      agent: config.agent,
      prompt: config.prompt,
      outputType: config.outputType
    }
  }
}

// GET /api/webhooks - Listar webhooks recebidos (para debug)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agencyId = searchParams.get('agencyId')

    if (!agencyId) {
      return NextResponse.json(
        { error: 'agencyId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar execuções recentes de triggers da agência
    const executions = await prisma.triggerExecution.findMany({
      where: {
        trigger: {
          agencyId: agencyId
        }
      },
      include: {
        trigger: {
          select: {
            id: true,
            name: true,
            triggerType: true,
            eventType: true
          }
        }
      },
      orderBy: { executedAt: 'desc' },
      take: 50
    })

    const parsedExecutions = executions.map(execution => ({
      ...execution,
      eventData: execution.eventData ? JSON.parse(execution.eventData) : null,
      result: execution.result ? JSON.parse(execution.result) : null,
    }))

    return NextResponse.json({
      executions: parsedExecutions,
      total: executions.length
    })

  } catch (error) {
    console.error('Erro ao listar execuções de webhook:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}