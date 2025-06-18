import { z } from 'zod'

// Clientes
export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export const clientsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100).default('10'),
})

// Projetos
export const createProjectSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
  budget: z.number().positive('Orçamento deve ser positivo').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const projectsQuerySchema = z.object({
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
  clientId: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100).default('10'),
})

// Receitas
export const createRevenueSchema = z.object({
  description: z.string().min(2, 'Descrição deve ter pelo menos 2 caracteres'),
  amount: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  isRecurring: z.boolean().optional(),
  date: z.string(),
})

export const revenuesQuerySchema = z.object({
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  category: z.string().optional(),
  isRecurring: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100).default('10'),
})

// Despesas
export const createExpenseSchema = z.object({
  description: z.string().min(2, 'Descrição deve ter pelo menos 2 caracteres'),
  amount: z.number().positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string(),
})

export const expensesQuerySchema = z.object({
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100).default('10'),
})