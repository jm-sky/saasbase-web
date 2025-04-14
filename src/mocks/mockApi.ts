import { useLocalStorage } from '@vueuse/core'
import { type AxiosInstance } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { config } from '@/config'
import { setupAuthMocks } from '@/mocks/domains/auth/auth.mock'
import { setupContractorMocks } from '@/mocks/domains/contractor/contractor.mock'
import { setupProjectMocks } from '@/mocks/domains/project/project.mock'
import { setupUserMocks } from '@/mocks/domains/user/user.mock'
import type { MockStorage } from '@/mocks/mock.type'

const STORAGE: MockStorage = {
  users: [],
  tokens: [],
  projects: [],
  contractors: [],
}

/**
 * https://github.com/ctimmerm/axios-mock-adapter
 */
export const mockApi = (axios: AxiosInstance) => {
  const storage = useLocalStorage<MockStorage>(`${config.appId}:mockStorage`, STORAGE)
  const mock = new AxiosMockAdapter(axios, { delayResponse: 200 })

  setupAuthMocks(mock, storage.value)
  setupUserMocks(mock, storage.value)
  setupProjectMocks(mock, storage.value)
  setupContractorMocks(mock, storage.value)
}
