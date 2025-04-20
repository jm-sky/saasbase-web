import { useLocalStorage } from '@vueuse/core'
import { type AxiosInstance } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { config } from '@/config'
import { setupAuthMocks } from '@/domains/auth/mocks/auth.mock'
import { ProjectFactory } from '@/domains/project/factories/projectFactory'
import { setupProjectMocks } from '@/domains/project/mocks/project.mock'
import { UserFactory } from '@/domains/user/factories/userFactory'
import { setupUserMocks } from '@/domains/user/mocks/user.mock'
import { setupContractorMocks } from '@/mocks/domains/contractor/contractor.mock'
import { ContractorFactory } from '@/mocks/domains/contractor/contractorFactory'
import { setupProductMocks } from '@/mocks/domains/product/product.mock'
import { ProductFactory } from '@/mocks/domains/product/productFactory'
import type { Ref } from 'vue'
import type { MockStorage } from '@/mocks/mock.type'

const STORAGE: MockStorage = {
  users: [],
  tokens: [],
  projects: [],
  contractors: [],
  products: [],
}

const seedMockStorage = (storage: Ref<MockStorage>) => {
  storage.value.users.push(UserFactory.create())
  storage.value.projects.push(ProjectFactory.create())
  storage.value.contractors.push(ContractorFactory.create())
  storage.value.contractors.push(ContractorFactory.create())
  storage.value.contractors.push(ContractorFactory.create())
  storage.value.products.push(ProductFactory.create())
  storage.value.products.push(ProductFactory.create())
  storage.value.products.push(ProductFactory.create())
}

/**
 * https://github.com/ctimmerm/axios-mock-adapter
 */
export const mockApi = (axios: AxiosInstance, seed = true) => {
  console.log('[mockApi] Using backend mocking | config:', config)
  const storage = useLocalStorage<MockStorage>(`${config.appId}:mockStorage`, STORAGE)
  const mock = new AxiosMockAdapter(axios, { delayResponse: 200 })

  if (seed) seedMockStorage(storage)

  setupAuthMocks(mock, storage.value)
  setupUserMocks(mock, storage.value)
  setupProjectMocks(mock, storage.value)
  setupContractorMocks(mock, storage.value)
  setupProductMocks(mock, storage.value)
}
