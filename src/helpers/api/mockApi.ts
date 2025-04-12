import { useLocalStorage } from '@vueuse/core'
import { type AxiosInstance } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { config } from '@/config'
import { setupAuthMocks } from '@/helpers/api/mocks/domains/auth.mock'
import { setupContractorMocks } from '@/helpers/api/mocks/domains/contractor.mock'
import { setupProjectMocks } from '@/helpers/api/mocks/domains/project.mock'
import { setupUserMocks } from '@/helpers/api/mocks/domains/user.mock'
import type { MockStorage } from '@/helpers/api/mocks/mock.type'

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
