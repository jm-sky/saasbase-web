import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { IUserProfile } from '../services/userProfileService'

export const userProfilechema = toTypedSchema<z.ZodSchema, IUserProfile>(z.object({
  isPublicProfile: z.boolean().default(false),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  birthDate: z.string().nullable(),
  position: z.string().nullable(),
  website: z.string().nullable(),
  socialLinks: z.object({
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    twitter: z.string().nullable(),
    linkedin: z.string().nullable(),
    youtube: z.string().nullable(),
  }),
}))
