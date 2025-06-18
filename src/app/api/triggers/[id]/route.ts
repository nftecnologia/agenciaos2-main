import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireTenant } from '@/lib/tenant'
import { applyRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

const updateTriggerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
  triggerType: z.enum(['webhook', 'schedule', 'event', 'condition']).optional(),
  eventType: z.enum(['client_created', 'project_completed', 'revenue_added', 'task_completed', 'deadline_approaching']).optional(),
  conditions: z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains']),
    value: z.string(),
  }).optional(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    time: z.string(),
    dayOfWeek: z.number().min(0).max(6).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
  }).optional(),
  actions: z.array(z.object({
    type: z.enum(['email', 'webhook', 'ai_generation', 'task_creation', 'notification']),
    config: z.record(z.any()),
  })).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/triggers/[id] - Obter trigger específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const { id: triggerId } = await params

    const trigger = await prisma.trigger.findFirst({
      where: {
        id: triggerId,
        agencyId: context.agencyId,
      },
      include: {
        executions: {
          orderBy: { executedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            executions: true
          }
        }
      }
    })

    if (!trigger) {
      return NextResponse.json(
        { error: 'Trigger não encontrado' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedTrigger = {
      ...trigger,
      conditions: trigger.conditions ? JSON.parse(trigger.conditions) : null,
      schedule: trigger.schedule ? JSON.parse(trigger.schedule) : null,
      actions: JSON.parse(trigger.actions),
      executions: trigger.executions.map(execution => ({
        ...execution,
        eventData: execution.eventData ? JSON.parse(execution.eventData) : null,
        result: execution.result ? JSON.parse(execution.result) : null,
      }))
    }

    return NextResponse.json(parsedTrigger)

  } catch (error) {
    console.error('Erro ao buscar trigger:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}

// PUT /api/triggers/[id] - Atualizar trigger
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const { id: triggerId } = await params
    const body = await request.json()
    const validatedData = updateTriggerSchema.parse(body)

    // Verificar se o trigger existe e pertence à agência
    const existingTrigger = await prisma.trigger.findFirst({
      where: {
        id: triggerId,
        agencyId: context.agencyId,
      },
    })

    if (!existingTrigger) {
      return NextResponse.json(
        { error: 'Trigger não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    }

    // Handle JSON fields
    if (validatedData.conditions) {
      updateData.conditions = JSON.stringify(validatedData.conditions)
    }
    if (validatedData.schedule) {
      updateData.schedule = JSON.stringify(validatedData.schedule)
    }
    if (validatedData.actions) {
      updateData.actions = JSON.stringify(validatedData.actions)
    }

    const trigger = await prisma.trigger.update({
      where: { id: triggerId },
      data: updateData,
    })

    return NextResponse.json(trigger)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar trigger:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}

// DELETE /api/triggers/[id] - Deletar trigger
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResult = await applyRateLimit(request, 'api')
    if (!rateLimitResult.success && rateLimitResult.error) {
      throw rateLimitResult.error
    }

    const context = await requireTenant()
    const { id: triggerId } = await params

    // Verificar se o trigger existe e pertence à agência
    const existingTrigger = await prisma.trigger.findFirst({
      where: {
        id: triggerId,
        agencyId: context.agencyId,
      },
    })

    if (!existingTrigger) {
      return NextResponse.json(
        { error: 'Trigger não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o trigger (as execuções serão deletadas automaticamente por cascade)
    await prisma.trigger.delete({
      where: { id: triggerId },
    })

    return NextResponse.json({
      message: 'Trigger deletado com sucesso',
    })

  } catch (error) {
    console.error('Erro ao deletar trigger:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: error instanceof Error && error.message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}