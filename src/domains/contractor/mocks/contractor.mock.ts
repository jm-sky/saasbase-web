import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { ContractorFactory } from '@/domains/contractor/factories/contractorFactory'
import { createContractorSchema, updateContractorSchema } from '@/domains/contractor/validation/contractor.schema'
import { sendResponse, validationError } from '@/mocks/helpers/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage } from '@/mocks/mock.type'

export const setupContractorMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  // Create
  mock.onPost('/api/v1/contractors').reply(async (config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data)
    const { value, errors } = await createContractorSchema.parse(payload)

    if (!value) return validationError(errors)

    const contractor = ContractorFactory.create(value)
    storage.contractors.push(contractor)

    const response = { status: HttpStatusCode.Created, data: contractor }
    return sendResponse(response, 'createContractor')
  })

  // Read (List)
  mock.onGet('/api/v1/contractors').reply(() => {
    const contractors = storage.contractors
    const response = { status: HttpStatusCode.Ok, data: { contractors } }
    return sendResponse(response, 'listContractors')
  })

  // Read (Single)
  mock.onGet(/\/api\/v1\/contractors\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const contractor = storage.contractors.find(c => c.id === id)

    if (!contractor) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Contractor not found' } }, 'getContractor')
    }

    const response = { status: HttpStatusCode.Ok, data: contractor }
    return sendResponse(response, 'getContractor')
  })

  // Update
  mock.onPut(/\/api\/v1\/contractors\/\w+/).reply(async (config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const payload = JSON.parse(config.data)
    const { value, errors } = await updateContractorSchema.parse(payload)

    if (!value) return validationError(errors)

    const index = storage.contractors.findIndex(c => c.id === id)
    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Contractor not found' } }, 'updateContractor')
    }

    const updatedContractor = { ...storage.contractors[index], ...value, updatedAt: new Date().toISOString() }
    storage.contractors[index] = updatedContractor

    const response = { status: HttpStatusCode.Ok, data: updatedContractor }
    return sendResponse(response, 'updateContractor')
  })

  // Delete
  mock.onDelete(/\/api\/v1\/contractors\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const index = storage.contractors.findIndex(c => c.id === id)

    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Contractor not found' } }, 'deleteContractor')
    }

    storage.contractors.splice(index, 1)
    return sendResponse({ status: HttpStatusCode.NoContent, data: null }, 'deleteContractor')
  })
}
