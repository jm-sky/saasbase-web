import { z } from 'zod'
import { projectStatuses } from '@/constants/status'

export const projectSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(projectStatuses as [string, ...string[]]),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createProjectSchema = projectSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateProjectSchema = createProjectSchema.partial()
