import { config } from '@/config'
import type { InternalAxiosRequestConfig } from 'axios'

export const authorizeOutgoingRequests = (request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(`${config.appId}:token`)
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
}
