import { z } from 'zod'

export const commentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  commentableId: z.string().uuid(),
  commentableType: z.enum(['Project', 'Task', 'Contractor', 'Invoice']),
  createdAt: z.string().datetime(),
})

export const createCommentSchema = commentSchema.omit({ id: true, createdAt: true })
export const updateCommentSchema = createCommentSchema.partial()
