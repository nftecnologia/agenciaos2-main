import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { applyRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

const createTriggerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  triggerType: z.enum(['webhook', 'schedule', 'event', 'condition']),
  eventType: z.enum(['client_created', 'project_completed', 'revenue_added', 'task_completed', 'deadline_approaching']).optional(),
  conditions: z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains']),
    value: z.string(),
  }).optional(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    time: z.string(), // HH:MM format
    dayOfWeek: z.number().min(0).max(6).optional(), // 0 = Sunday
    dayOfMonth: z.number().min(1).max(31).optional(),
  }).optional(),
  actions: z.array(z.object({
    type: z.enum(['email', 'webhook', 'ai_generation', 'task_creation', 'notification']),
    config: z.record(z.any()),
  })),
  isActive: z.boolean().default(true),
})

const triggerExecutionSchema = z.object({
  triggerId: z.string().cuid(),
  eventData: z.record(z.any()).optional(),
})

// GET /api/triggers - Listar triggers da agência
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isActive = searchParams.get('active')

    const where = {
      agencyId: context.agencyId,
      ...(isActive !== null && { isActive: isActive === 'true' })
    }

    const [triggers, total] = await Promise.all([
      prisma.trigger.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              executions: true
            }
          }
        }
      }),
      prisma.trigger.count({ where })
    ])

    return NextResponse.json({
      triggers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar triggers:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}

// POST /api/triggers - Criar novo trigger
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const validatedData = createTriggerSchema.parse(body)

    // Validações específicas por tipo
    if (validatedData.triggerType === 'schedule' && !validatedData.schedule) {
      return NextResponse.json(
        { error: 'Schedule é obrigatório para triggers agendados' },
        { status: 400 }
      )
    }

    if (validatedData.triggerType === 'event' && !validatedData.eventType) {
      return NextResponse.json(
        { error: 'EventType é obrigatório para triggers de evento' },
        { status: 400 }
      )
    }

    if (validatedData.triggerType === 'condition' && !validatedData.conditions) {
      return NextResponse.json(
        { error: 'Conditions é obrigatório para triggers condicionais' },
        { status: 400 }
      )
    }

    const trigger = await prisma.trigger.create({
      data: {
        ...validatedData,
        agencyId: context.agencyId,
        createdBy: context.user.id,
        conditions: validatedData.conditions ? JSON.stringify(validatedData.conditions) : null,
        schedule: validatedData.schedule ? JSON.stringify(validatedData.schedule) : null,
        actions: JSON.stringify(validatedData.actions),
      }
    })

    return NextResponse.json(trigger, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar trigger:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}

// PATCH /api/triggers - Executar trigger manualmente (para testes)
export async function PATCH(request: NextRequest) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const body = await request.json()
    const validatedData = triggerExecutionSchema.parse(body)

    // Buscar o trigger
    const trigger = await prisma.trigger.findFirst({
      where: {
        id: validatedData.triggerId,
        agencyId: context.agencyId,
        isActive: true
      }
    })

    if (!trigger) {
      return NextResponse.json(
        { error: 'Trigger não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Simular execução do trigger
    const execution = await prisma.triggerExecution.create({
      data: {
        triggerId: trigger.id,
        status: 'SUCCESS',
        executedAt: new Date(),
        eventData: validatedData.eventData ? JSON.stringify(validatedData.eventData) : null,
        result: JSON.stringify({
          message: 'Execução manual bem-sucedida',
          actions: JSON.parse(trigger.actions),
          timestamp: new Date().toISOString()
        })
      }
    })

    // Aqui você implementaria a lógica real de execução das ações
    // Por exemplo: enviar e-mails, chamar webhooks, criar tarefas, etc.
    
    return NextResponse.json({
      execution,
      message: 'Trigger executado com sucesso',
      actions: JSON.parse(trigger.actions)
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao executar trigger:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}