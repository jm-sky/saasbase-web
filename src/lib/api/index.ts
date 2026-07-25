import axios, { AxiosError } from 'axios'
import { config } from '@/config'
import { interceptUnauthorized } from '@/lib/api/interceptUnauthorized'
import { authorizeOutgoingRequests } from './authorizeOutgoingRequests'
import { interceptTenantRequired } from './interceptTenantRequired'
import { interceptTwoFactorRequired } from './interceptTwoFactorRequired'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to handle authorization
api.interceptors.request.use((request: InternalAxiosRequestConfig) => authorizeOutgoingRequests(request))

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => interceptUnauthorized(error),
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => interceptTenantRequired(error),
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => interceptTwoFactorRequired(error),
)

export default api
