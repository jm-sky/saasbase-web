import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import type {
  IContractor,
  IContractorAddressCreate,
  IContractorBankAccountCreate,
  IContractorContactCreate,
  IContractorCreate
} from '@/domains/contractor/models/contractor.model'

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

const baseContractorSchema = z.object({
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

const createContractorBaseSchema = baseContractorSchema.omit({ id: true, createdAt: true, updatedAt: true })
const updateContractorBaseSchema = createContractorBaseSchema.partial()

export const contractorSchema = toTypedSchema<ZodSchema, IContractor>(baseContractorSchema)
export const createContractorSchema = toTypedSchema<ZodSchema, IContractorCreate>(createContractorBaseSchema)
export const updateContractorSchema = toTypedSchema<ZodSchema, Partial<IContractorCreate>>(updateContractorBaseSchema)

export const contractorAddressCreateSchema = toTypedSchema<ZodSchema, IContractorAddressCreate>(
  contractorAddressSchema.omit({ id: true, contractorId: true })
)
export const contractorBankAccountCreateSchema = toTypedSchema<ZodSchema, IContractorBankAccountCreate>(
  contractorBankAccountSchema.omit({ id: true, contractorId: true })
)
export const contractorContactPersonCreateSchema = toTypedSchema<ZodSchema, IContractorContactCreate>(
  contractorContactPersonSchema.omit({ id: true, contractorId: true })
)
