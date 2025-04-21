import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { IProductCreate } from '@/models/product.model'

export const createProductSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    unitId: z.string().min(1, 'Unit is required'),
    priceNet: z.number().min(0, 'Price must be non-negative'),
    vatRateId: z.string().min(1, 'VAT rate is required'),
  }).transform((data) => data as IProductCreate)
)

export const updateProductSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    unitId: z.string().min(1, 'Unit is required').optional(),
    priceNet: z.number().min(0, 'Price must be non-negative').optional(),
    vatRateId: z.string().min(1, 'VAT rate is required').optional(),
  })
)
