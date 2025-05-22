import axios, { AxiosError } from 'axios'
import { DEFAULT_LOCALE } from '@/i18n'
import { interceptUnauthorized } from '@/lib/api/interceptUnauthorized'
import { authorizeOutgoingRequests } from './authorizeOutgoingRequests'
import { interceptTenantRequired } from './interceptTenantRequired'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': DEFAULT_LOCALE,
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

export default api
