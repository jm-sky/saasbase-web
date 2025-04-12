import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { fakeUser } from '@/factories/fakeUser'
import { toPublicUser } from '@/helpers/api/mocks/toPublicUser'
import { toUserData } from '@/helpers/api/mocks/toUserData'
import { sendResponse } from '@/helpers/api/mocks/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage } from '@/helpers/api/mocks/mock.type'
import type { IPublicUser, IUserData } from '@/models/user.model'

export const setupUserMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  mock.onGet('/user').reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][user]', config)
    const userData = storage.users.at(0) ?? fakeUser()
    const user: IUserData = toUserData({
      ...userData,
      birthDate: userData.birthDate instanceof Date ? userData.birthDate.toISOString() : userData.birthDate,
      createdAt: userData.createdAt instanceof Date ? userData.createdAt.toISOString() : userData.createdAt,
    })
    const response = { status: HttpStatusCode.Ok, data: user }
    return sendResponse(response, 'user')
  })

  mock.onGet('/users').reply(() => {
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
