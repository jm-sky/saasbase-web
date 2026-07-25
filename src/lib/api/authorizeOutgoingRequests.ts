import { config } from '@/config'
import { useLanguageStore } from '@/stores/language.store'
import type { InternalAxiosRequestConfig } from 'axios'

export const authorizeOutgoingRequests = (request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(`${config.appId}:token`)
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }

  // Was set once, statically, when the axios instance was created — never
  // updated when the user switches language, so every backend-generated
  // message (validation errors, policy-denial messages) stayed in
  // whatever locale was active at page load, regardless of the UI.
  request.headers['Accept-Language'] = useLanguageStore().currentLocale

  return request
}
