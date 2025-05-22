import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const userProfilechema = toTypedSchema(z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First name must not be longer than 30 characters.',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last name must not be longer than 30 characters.',
    }),
  description: z.string().max(160, { message: 'Description must not be longer than 160 characters.' }).min(4, { message: 'Bio must be at least 2 characters.' }),
  birthDate: z.string().nullable(),
  phone: z.string().nullable(),
}))
