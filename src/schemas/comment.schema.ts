import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import type { IComment, ICommentCreate } from '@/models/comment.model'

const baseCommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  commentableId: z.string().uuid(),
  commentableType: z.enum(['Project', 'Task', 'Contractor', 'Invoice']),
  createdAt: z.string().datetime(),
})

const createCommentBaseSchema = baseCommentSchema.omit({ id: true, createdAt: true })
const updateCommentBaseSchema = createCommentBaseSchema.partial()

export const commentSchema = toTypedSchema<ZodSchema, IComment>(baseCommentSchema)
export const createCommentSchema = toTypedSchema<ZodSchema, ICommentCreate>(createCommentBaseSchema)
export const updateCommentSchema = toTypedSchema<ZodSchema, Partial<ICommentCreate>>(updateCommentBaseSchema)
