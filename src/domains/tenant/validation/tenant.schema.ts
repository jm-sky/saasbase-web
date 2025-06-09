import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import type { ITenantCreate } from '@/domains/tenant/types/tenant.type'

export const tenantSchema = toTypedSchema<ZodSchema, ITenantCreate>(z.object({
  name: z.string().min(1).max(50),
  email: z.string().email().min(1).max(50).optional(),
  phone: z.string().min(1).max(50).optional(),
  website: z.string().min(1).max(50).optional(),
  country: z.string().min(1).max(50).optional(),
  description: z.string().min(1).max(50).optional(),
}))

export const tenantCreateSchema = toTypedSchema<ZodSchema, ITenantCreate>(z.object({
  country: z.string().min(2),
  vatId: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  regon: z.string().optional(),
  taxId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    region: z.string().optional(),
    country: z.string().min(2),
  }),
  bankAccount: z.object({
    iban: z.string().min(10),
    bankName: z.string().min(2),
    swift: z.string().optional(),
  }),
}))