import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import { taskPriorities, taskStatuses } from '@/domains/shared/types/status'
import type { ITask, ITaskCreate } from '@/domains/task/types/task.type'

const baseTaskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(taskStatuses as [string, ...string[]]),
  priority: z.enum(taskPriorities as [string, ...string[]]),
  assignedToId: z.string().uuid().optional(),
  createdById: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

const createTaskBaseSchema = baseTaskSchema.omit({ id: true, createdAt: true, updatedAt: true })
const updateTaskBaseSchema = createTaskBaseSchema.partial()

export const taskSchema = toTypedSchema<ZodSchema, ITask>(baseTaskSchema)
export const createTaskSchema = toTypedSchema<ZodSchema, ITaskCreate>(createTaskBaseSchema)
export const updateTaskSchema = toTypedSchema<ZodSchema, Partial<ITaskCreate>>(updateTaskBaseSchema)
