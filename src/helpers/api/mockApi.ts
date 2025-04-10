import { useLocalStorage } from '@vueuse/core'
import { type AxiosInstance, type AxiosRequestConfig, HttpStatusCode } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { config } from '@/config'
import { fakeUser } from '@/factories/fakeUser'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { createMockUser } from '@/helpers/api/mocks/createMockUser'
import { genJWTMock } from '@/helpers/api/mocks/genJWT'
import { toPublicUser } from '@/helpers/api/mocks/toPublicUser'
import { toUserData } from '@/helpers/api/mocks/toUserData'
import { credentialsSchema, registrationSchema } from '@/schemas/auth.schema'
import type { MockStorage } from '@/helpers/api/mocks/mock.type'
import type { IPublicUser, IUserData } from '@/models/user.model'
import type { Credentials, RegistrationData } from '@/types/auth.type'

const STORAGE: MockStorage = {
  users: [],
  tokens: [],
}

const validationError = (errors: object) => ({ status: HttpStatusCode.UnprocessableEntity, data: { errors } })

const sendResponse = <T extends object>(response: T, title: string): T => {
  console.log(`[mockApi][${title}] response:`, response)
  return response
}

/**
 * https://github.com/ctimmerm/axios-mock-adapter
 */
export const mockApi = (axios: AxiosInstance) => {
  const storage = useLocalStorage<MockStorage>(`${config.appId}:mockStorage`, STORAGE)
  const mock = new AxiosMockAdapter(axios, { delayResponse: 200 })

  mock.onPost(apiRoutesMap.authRegister).reply(async (config: AxiosRequestConfig) => {
    const payload: RegistrationData = JSON.parse(config.data)
    console.log('[mockApi][authRegister] payload:', payload)
    const { value, errors } = await registrationSchema.parse(payload)

    if (!value) return validationError(errors)

    if (storage.value.users.find(u => u.email === value.email)) {
      return sendResponse(validationError({ email: ['E-mail already taken'] }), 'authRegister')
    }

    const user = createMockUser(value)
    storage.value.users.push(user)

    const response = { status: HttpStatusCode.Created, data: user }
    return sendResponse(response, 'authRegister')
  })

  mock.onPost(apiRoutesMap.authLogin).reply(async (config: AxiosRequestConfig) => {
    const payload: Credentials = JSON.parse(config.data)
    console.log('[mockApi][authLogin]', payload)
    const { value, errors } = await credentialsSchema.parse(payload)

    if (!value) return validationError(errors)

    const user = storage.value.users.find(u => u.email === value.email)

    if (!user) {
      return sendResponse(validationError({ email: ['Invalid credentials'] }), 'authLogin')
    }

    const token = genJWTMock({ uid: user.id })
    storage.value.tokens.push(token)

    const response = { status: HttpStatusCode.Ok, data: { token } }
    return sendResponse(response, 'authLogin')
  })

  mock.onGet(apiRoutesMap.user).reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][user]', config)
    const userData = storage.value.users.at(0) ?? fakeUser()
    const user: IUserData = toUserData(userData)
    const response = { status: HttpStatusCode.Ok, data: user }
    return sendResponse(response, 'user')
  })

  mock.onGet(apiRoutesMap.users).reply(() => {
    const users: IPublicUser[] = [
      toPublicUser(fakeUser()),
      toPublicUser(fakeUser(true)),
      toPublicUser(fakeUser(true)),
      toPublicUser(fakeUser()),
      toPublicUser(fakeUser(true)),
      toPublicUser(fakeUser(true)),
    ]

    return { status: HttpStatusCode.Ok, data: { users } }
  })
}
