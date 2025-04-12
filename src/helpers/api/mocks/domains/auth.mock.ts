import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { createMockUser } from '@/helpers/api/mocks/createMockUser'
import { genJWTMock } from '@/helpers/api/mocks/genJWT'
import { sendResponse, validationError } from '@/helpers/api/mocks/utils'
import { credentialsSchema, registrationSchema } from '@/schemas/auth.schema'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage, MockUserStored } from '@/helpers/api/mocks/mock.type'
import type { Credentials, RegistrationData } from '@/types/auth.type'

export const setupAuthMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  mock.onPost('/auth/register').reply(async (config: AxiosRequestConfig) => {
    const payload: RegistrationData = JSON.parse(config.data)
    console.log('[mockApi][authRegister] payload:', payload)
    const { value, errors } = await registrationSchema.parse(payload)

    if (!value) return validationError(errors)

    if (storage.users.find(u => u.email === value.email)) {
      return sendResponse(validationError({ email: ['E-mail already taken'] }), 'authRegister')
    }

    const user = createMockUser(value)
    const storedUser: MockUserStored = {
      ...user,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString() : undefined,
      createdAt: new Date(user.createdAt).toISOString(),
      password: value.password,
    }
    storage.users.push(storedUser)

    const response = { status: HttpStatusCode.Created, data: user }
    return sendResponse(response, 'authRegister')
  })

  mock.onPost('/auth/login').reply(async (config: AxiosRequestConfig) => {
    const payload: Credentials = JSON.parse(config.data)
    console.log('[mockApi][authLogin]', payload)
    const { value, errors } = await credentialsSchema.parse(payload)

    if (!value) return validationError(errors)

    const user = storage.users.find(u => u.email === value.email)

    if (!user) {
      return sendResponse(validationError({ email: ['Invalid credentials'] }), 'authLogin')
    }

    const token = genJWTMock({ uid: user.id })
    storage.tokens.push(token)

    const response = { status: HttpStatusCode.Ok, data: { token } }
    return sendResponse(response, 'authLogin')
  })
}
