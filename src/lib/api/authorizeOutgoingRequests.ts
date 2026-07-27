import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useLanguageStore } from '@/stores/language.store'
import type { InternalAxiosRequestConfig } from 'axios'

export const authorizeOutgoingRequests = (request: InternalAxiosRequestConfig) => {
  // Read from the Pinia/auth ref — not raw localStorage — so a freshly
  // switched tenant JWT is sent on the very next request (VueUse storage
  // write is async via a watcher).
  const token = useAuthStore().token
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
