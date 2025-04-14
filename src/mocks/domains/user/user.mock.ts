import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { UserFactory } from '@/mocks/domains/user/userFactory'
import { toPublicUser } from '@/mocks/helpers/toPublicUser'
import { toUserData } from '@/mocks/helpers/toUserData'
import { sendResponse } from '@/mocks/helpers/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage, MockUserStored } from '@/mocks/mock.type'
import type { IPublicUser, IUserData } from '@/models/user.model'

export const setupUserMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  mock.onGet('/user').reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][user]', config)
    const userData: MockUserStored = storage.users.at(0) ?? UserFactory.createUser()
    const user: IUserData = toUserData({...userData})
    const response = { status: HttpStatusCode.Ok, data: user }
    return sendResponse(response, 'user')
  })

  mock.onGet('/users').reply(() => {
    const users: IPublicUser[] = [
      toPublicUser(UserFactory.createUser()),
      toPublicUser(UserFactory.createUser(undefined, true)),
      toPublicUser(UserFactory.createUser(undefined, true)),
      toPublicUser(UserFactory.createUser()),
      toPublicUser(UserFactory.createUser(undefined, true)),
      toPublicUser(UserFactory.createUser(undefined, true)),
    ]

    return { status: HttpStatusCode.Ok, data: { users } }
  })
}
