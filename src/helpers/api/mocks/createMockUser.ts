import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { MockUserStored } from '@/helpers/api/mocks/mock.type'
import type { RegistrationData } from '@/types/auth.type'

export const createMockUser = (data: RegistrationData): MockUserStored => {
  return {
    id: v4(),
    ...data,
    password: btoa(data.password),
    createdAt: formatISO(new Date()),
  }
}
