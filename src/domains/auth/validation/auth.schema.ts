import { toTypedSchema } from '@vee-validate/zod'
import { z, ZodSchema } from 'zod'
import type { Credentials, ForgotPasswordData, RegistrationData, ResetPasswordData } from '@/domains/auth/types/auth.type'

export const credentialsSchema = toTypedSchema<ZodSchema, Credentials>(z.object({
  email: z.string().email().min(1).max(50),
  password: z.string().min(4, 'Hasło musi zawierać minimum 4 znaki').max(50),
  remember: z.boolean().optional(),
}))

export const forgotPasswordSchema = toTypedSchema<ZodSchema, ForgotPasswordData>(z.object({
  email: z.string().email().min(1).max(50),
}))

export const resetPasswordSchema = toTypedSchema<ZodSchema, ResetPasswordData>(z.object({
  token: z.string().min(32, 'Token musi zawierać minimum 32 znaki'),
  email: z.string().email().min(1).max(50),
  password: z.string().min(4).max(50),
  passwordConfirmation: z.string().min(4).max(50),
}))

export const registrationSchema = toTypedSchema<ZodSchema, RegistrationData>(z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().min(1).max(50),
  password: z.string().min(4).max(50),
}))
