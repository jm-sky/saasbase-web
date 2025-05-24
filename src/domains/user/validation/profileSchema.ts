import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { IUserProfile } from '../services/userProfileService'

export const userProfilechema = toTypedSchema<z.ZodSchema, IUserProfile>(z.object({
  bio: z.string().max(160, { message: 'Description must not be longer than 160 characters.' }).min(4, { message: 'Bio must be at least 2 characters.' }),
  location: z.string().nullable(),
  birthDate: z.string().nullable(),
  position: z.string().nullable(),
  website: z.string().nullable(),
  socialLinks: z.object({
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
  }),
}))
