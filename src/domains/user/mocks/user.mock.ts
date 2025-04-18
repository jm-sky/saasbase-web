import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { UserFactory } from '@/domains/user/factories/userFactory'
import { toPublicUser } from '@/mocks/helpers/toPublicUser'
import { toUserData } from '@/mocks/helpers/toUserData'
import { sendResponse } from '@/mocks/helpers/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { IPublicUser, IUser, IUserStored } from '@/domains/user/types/user.type'
import type { MockStorage } from '@/mocks/mock.type'

export const setupUserMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  mock.onGet('/api/v1/user').reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][user]', config)
    const userData: IUserStored = storage.users.at(0) ?? UserFactory.create()
    const user: IUser = toUserData({...userData})
    const response = { status: HttpStatusCode.Ok, data: user }
    return sendResponse(response, 'user')
  })

  mock.onGet('/api/v1/users').reply(() => {
    const users: IPublicUser[] = [
      toPublicUser(UserFactory.create()),
      toPublicUser(UserFactory.create(undefined, true)),
      toPublicUser(UserFactory.create(undefined, true)),
      toPublicUser(UserFactory.create()),
      toPublicUser(UserFactory.create(undefined, true)),
      toPublicUser(UserFactory.create(undefined, true)),
    ]

    return { status: HttpStatusCode.Ok, data: { users } }
  })
}
