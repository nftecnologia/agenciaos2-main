import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  agencyName: z.string().min(2, 'Nome da agência deve ter pelo menos 2 caracteres'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar dados
    const validatedData = registerSchema.parse(body)
    const { name, email, password, agencyName } = validatedData

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 400 }
      )
    }

    // Gerar slug da agência
    const slug = agencyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplos
      .trim()

    // Verificar se slug já existe
    const existingAgency = await prisma.agency.findUnique({
      where: { slug },
    })

    if (existingAgency) {
      return NextResponse.json(
        { error: 'Já existe uma agência com este nome' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário e agência em transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'OWNER',
        },
      })

      // Criar agência
      const agency = await tx.agency.create({
        data: {
          name: agencyName,
          slug,
          ownerId: user.id,
          plan: 'FREE',
        },
      })

      // Atualizar usuário com agencyId
      await tx.user.update({
        where: { id: user.id },
        data: { agencyId: agency.id },
      })

      return { user, agency }
    })

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        agencyId: result.agency.id,
      },
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}