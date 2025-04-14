import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import { projectStatuses } from '@/constants/status'
import type { IProject, IProjectCreate } from '@/models/project.model'

const baseProjectSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(projectStatuses as [string, ...string[]]),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

const createProjectBaseSchema = baseProjectSchema.omit({ id: true, createdAt: true, updatedAt: true })
const updateProjectBaseSchema = createProjectBaseSchema.partial()

export const projectSchema = toTypedSchema<ZodSchema, IProject>(baseProjectSchema)
export const createProjectSchema = toTypedSchema<ZodSchema, IProjectCreate>(createProjectBaseSchema)
export const updateProjectSchema = toTypedSchema<ZodSchema, Partial<IProjectCreate>>(updateProjectBaseSchema)
