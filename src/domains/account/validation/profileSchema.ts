import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
