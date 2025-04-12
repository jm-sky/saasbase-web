import { z } from 'zod'
import { taskPriorities, taskStatuses } from '@/constants/status'

export const taskSchema = z.object({
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

export const createTaskSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateTaskSchema = createTaskSchema.partial()
