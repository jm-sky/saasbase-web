import { HttpStatusCode } from 'axios'
import { type AxiosRequestConfig } from 'axios'
import { ProductFactory } from '@/domains/product/factories/productFactory'
import { createProductSchema, updateProductSchema } from '@/domains/product/validation/product.schema'
import { sendResponse, validationError } from '@/mocks/helpers/utils'
import type AxiosMockAdapter from 'axios-mock-adapter'
import type { MockStorage } from '@/mocks/mock.type'

export const setupProductMocks = (mock: AxiosMockAdapter, storage: MockStorage) => {
  // Create
  mock.onPost('/api/v1/products').reply(async (config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data)
    const { value, errors } = await createProductSchema.parse(payload)

    if (!value) return validationError(errors)

    const product = ProductFactory.create(value)
    storage.products.push(product)

    const response = { status: HttpStatusCode.Created, data: product }
    return sendResponse(response, 'createProduct')
  })

  // Read (List)
  mock.onGet('/api/v1/products').reply(() => {
    const products = storage.products
    const response = { status: HttpStatusCode.Ok, data: { products } }
    return sendResponse(response, 'listProducts')
  })

  // Read (Single)
  mock.onGet(/\/api\/v1\/products\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const product = storage.products.find(p => p.id === id)

    if (!product) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Product not found' } }, 'getProduct')
    }

    const response = { status: HttpStatusCode.Ok, data: product }
    return sendResponse(response, 'getProduct')
  })

  // Update
  mock.onPut(/\/api\/v1\/products\/\w+/).reply(async (config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const payload = JSON.parse(config.data)
    const { value, errors } = await updateProductSchema.parse(payload)

    if (!value) return validationError(errors)

    const index = storage.products.findIndex(p => p.id === id)
    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Product not found' } }, 'updateProduct')
    }

    const updatedProduct = { ...storage.products[index], ...value, updatedAt: new Date().toISOString() }
    storage.products[index] = updatedProduct

    const response = { status: HttpStatusCode.Ok, data: updatedProduct }
    return sendResponse(response, 'updateProduct')
  })

  // Delete
  mock.onDelete(/\/api\/v1\/products\/\w+/).reply((config: AxiosRequestConfig) => {
    const id = config.url?.split('/').pop()
    const index = storage.products.findIndex(p => p.id === id)

    if (index === -1) {
      return sendResponse({ status: HttpStatusCode.NotFound, data: { message: 'Product not found' } }, 'deleteProduct')
    }

    storage.products.splice(index, 1)
    return sendResponse({ status: HttpStatusCode.NoContent, data: null }, 'deleteProduct')
  })
}
