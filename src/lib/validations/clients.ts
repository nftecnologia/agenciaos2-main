import { z } from 'zod'

// Schema para criação de cliente
export const createClientSchema = z.object({
  name: z.string()
    .min(2, "Nome do cliente deve ter pelo menos 2 caracteres")
    .max(100, "Nome do cliente não pode exceder 100 caracteres"),
  email: z.string()
    .email("Email inválido")
    .max(100, "Email não pode exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .max(20, "Telefone não pode exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  company: z.string()
    .max(100, "Nome da empresa não pode exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  address: z.object({
    street: z.string().max(200, "Endereço não pode exceder 200 caracteres").optional(),
    city: z.string().max(100, "Cidade não pode exceder 100 caracteres").optional(),
    state: z.string().max(50, "Estado não pode exceder 50 caracteres").optional(),
    zipCode: z.string().max(20, "CEP não pode exceder 20 caracteres").optional(),
    country: z.string().max(50, "País não pode exceder 50 caracteres").optional()
  }).optional()
})

// Schema para atualização de cliente
export const updateClientSchema = createClientSchema.partial()

// Schema para query de clientes
export const clientsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(10)
})

// Tipos TypeScript derivados dos schemas
export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type ClientsQuery = z.infer<typeof clientsQuerySchema>
