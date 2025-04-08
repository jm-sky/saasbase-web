import { type AxiosInstance, type AxiosRequestConfig, HttpStatusCode } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { v4 } from 'uuid'
import { fakePublicUser } from '@/factories/fakePublicUser'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import type { IPublicUser, IUserData } from '@/models/user.model'

/**
 * https://github.com/ctimmerm/axios-mock-adapter
 */
export const mockApi = (axios: AxiosInstance) => {
  const mock = new AxiosMockAdapter(axios, { delayResponse: 200 })

  mock.onPost(apiRoutesMap.authLogin).reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][authLogin]', config)
    return [
      HttpStatusCode.Ok,
      {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDM2MDExNDQsImlzcyI6NTE0LCJleHAiOjE3NTEzNzcxNDR9.ONVz-KipOiKak4SvGq4mpv7TnArReus6HPuMeJR2geo',
      }
    ]
  })

  mock.onGet(apiRoutesMap.user).reply((config: AxiosRequestConfig) => {
    console.log('[mockApi][user]', config)
    const user: IUserData = {
      id: v4(),
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+48600700800',
      birthDate: '1986-01-10',
      address: {},
      image: undefined,
      createdAt: '2025-01-10T10:00:00Z',
    }
    return [HttpStatusCode.Ok, user]
  })

  mock.onGet(apiRoutesMap.users).reply(() => {
    const users: IPublicUser[] = [
      {
        id: v4(),
        firstName: 'Amy',
        lastName: 'Carmichael',
        email: 'amy.carmichael@mail.com',
        image: ''
      },
      fakePublicUser(true),
      fakePublicUser(true),
      fakePublicUser(),
      fakePublicUser(true),
      fakePublicUser(true),
    ]

    return [HttpStatusCode.Ok, { users }]
  })
}
