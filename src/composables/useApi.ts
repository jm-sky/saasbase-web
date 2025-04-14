import axios, { AxiosError } from 'axios'
import { interceptUnauthorized } from '@/composables/api/interceptUnauthorized'
import { config } from '@/config'
import { DEFAULT_LOCALE } from '@/i18n'
import { mockApi } from '@/mocks/mockApi'
import type { AxiosInstance, AxiosResponse } from 'axios'

export const useApi = () => {
  const api: AxiosInstance = axios.create({
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': DEFAULT_LOCALE,
    },
  })

  if (config.api.mockBackend) {
    mockApi(api)
  }

  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError) => interceptUnauthorized(error),
  )

  const setAuthorization = (token?: string | null) => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  }

  return {
    api,
    setAuthorization,
  }
}
