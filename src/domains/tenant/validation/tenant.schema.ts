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
