import { z } from 'zod'
import type { TUUID } from '@/types/common'

const uuidSchema = z.string().uuid()

const contractorAddressSchema = z.object({
  id: uuidSchema,
  contractorId: uuidSchema,
  label: z.string().min(1).max(50),
  countryId: uuidSchema,
  street: z.string().min(1).max(100),
  city: z.string().min(1).max(50),
  zip: z.string().min(1).max(20),
  isDefault: z.boolean(),
})

const contractorBankAccountSchema = z.object({
  id: uuidSchema,
  contractorId: uuidSchema,
  bankName: z.string().min(1).max(100),
  iban: z.string().min(1).max(34),
  currencies: z.array(z.string()),
  isDefault: z.boolean(),
})

const contractorContactPersonSchema = z.object({
  id: uuidSchema,
  contractorId: uuidSchema,
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  position: z.string().max(50).optional(),
})

export const contractorSchema = z.object({
  id: uuidSchema,
  tenantId: uuidSchema,
  name: z.string().min(1).max(100),
  taxId: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
  isSupplier: z.boolean(),
  isBuyer: z.boolean(),
  addresses: z.array(contractorAddressSchema).optional(),
  bankAccounts: z.array(contractorBankAccountSchema).optional(),
  contactPersons: z.array(contractorContactPersonSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createContractorSchema = contractorSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateContractorSchema = createContractorSchema.partial()
