import { z } from 'zod'

export const credentialsSchema = z.object({
  email: z.string().email().min(1).max(50),
  password: z.string().min(4, 'Hasło musi zawierać minimum 4 znaki').max(50),
  remember: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  email: z.string().email().min(1).max(50),
})

export const registrationSchema = z.object({
  name: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().min(1).max(50),
  password: z.string().min(4).max(50),
})
