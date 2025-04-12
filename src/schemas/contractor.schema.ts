import { z } from 'zod'

export const contractorSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(100),
  taxId: z.string().max(20).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  isSupplier: z.boolean(),
  isBuyer: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createContractorSchema = contractorSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateContractorSchema = createContractorSchema.partial()
