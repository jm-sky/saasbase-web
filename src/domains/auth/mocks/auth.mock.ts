import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { credentialsSchema, registrationSchema } from '@/domains/auth/validation/auth.schema'
import { UserFactory } from '@/domains/user/factories/userFactory'
import { genJWTMock } from '@/mocks/helpers/genJWT'
import { sendResponse, validationError } from '@/mocks/helpers/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { Credentials, RegistrationData } from '@/domains/auth/types/auth.type'
import type { IUserStored } from '@/domains/user/types/user.type'
import type { MockStorage } from '@/mocks/mock.type'

export const setupAuthMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  mock.onPost('/api/v1/auth/register').reply(async (config: AxiosRequestConfig) => {
    const payload: RegistrationData = JSON.parse(config.data)
    console.log('[mockApi][authRegister] payload:', payload)
    const result = await registrationSchema.safeParse(payload)

    if (!result.success) return validationError(result.error.errors)

    if (storage.users.find(u => u.email === result.data.email)) {
      return sendResponse(validationError({ email: ['E-mail already taken'] }), 'authRegister')
    }

    const user = UserFactory.create(result.data)
    const storedUser: IUserStored = {
      ...user,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString() : undefined,
      createdAt: new Date(user.createdAt).toISOString(),
      password: result.data.password,
    }
    storage.users.push(storedUser)

    const response = { status: HttpStatusCode.Created, data: user }
    return sendResponse(response, 'authRegister')
  })

  mock.onPost('/api/v1/auth/login').reply(async (config: AxiosRequestConfig) => {
    const payload: Credentials = JSON.parse(config.data)
    console.log('[mockApi][authLogin]', payload)
    const result = await credentialsSchema.safeParse(payload)

    if (!result.success) return validationError(result.error.errors)

    const user = storage.users.find(u => u.email === result.data.email)

    if (!user) {
      return sendResponse(validationError({ email: ['Invalid credentials'] }), 'authLogin')
    }

    const token = genJWTMock({ uid: user.id })
    storage.tokens.push(token)

    const response = { status: HttpStatusCode.Ok, data: { token } }
    return sendResponse(response, 'authLogin')
  })
}
