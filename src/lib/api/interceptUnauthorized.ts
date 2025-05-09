import axios, { AxiosError, HttpStatusCode } from 'axios'
import { useToast } from '@/components/ui/toast'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { i18n } from '@/i18n'
import router from '@/router'

const AUTH_TOKEN_URL = '/api/v1/auth/token'
const AUTH_REFRESH_TOKEN_URL = '/api/v1/auth/token/refresh'

class TokenRefreshError extends Error {
  constructor(message = 'Failed to refresh token') {
    super(message)
    this.name = 'TokenRefreshError'
  }
}

interface FailedQueueItem {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

// Helper functions
const isUnauthorized = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    (error.response?.status === HttpStatusCode.Unauthorized)
  )
}

const wasTokenRequest = (error: AxiosError): boolean =>
  error.config?.url?.endsWith(AUTH_TOKEN_URL) ?? false

const wasRefreshTokenRequest = (error: AxiosError): boolean =>
  error.config?.url?.endsWith(AUTH_REFRESH_TOKEN_URL) ?? false

const redirectToLoginPage = async (location: Location) => {
  if (location.pathname !== '/login') {
    await router.push('/login')
  }
}

// Queue for failed requests during token refresh
let isRefreshing = false
let failedQueue: FailedQueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

export const interceptUnauthorized = async (error: AxiosError): Promise<unknown> => {
  if (!isUnauthorized(error)) {
    throw error
  }

  const authStore = useAuthStore()
  const originalRequest = error.config

  // Handle token request failures
  if (wasTokenRequest(error) || wasRefreshTokenRequest(error)) {
    authStore.clearData()
    await redirectToLoginPage(window.location)
    throw error
  }

  // Handle unauthenticated state
  if (!authStore.isAuthenticated) {
    authStore.clearData()
    await redirectToLoginPage(window.location)
    throw error
  }

  // Handle token refresh
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
      .then((token) => {
        if (originalRequest && typeof token === 'string') {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        }
        return Promise.reject(new TokenRefreshError())
      })
      .catch((err: unknown) => {
        return Promise.reject(err instanceof Error ? err : new Error(String(err)))
      })
  }

  isRefreshing = true

  try {
    // Attempt to refresh the token
    const response = await axios.post(AUTH_REFRESH_TOKEN_URL)
    const newToken = response.data?.accessToken

    if (originalRequest && typeof newToken === 'string') {
      authStore.setToken(newToken)
      processQueue(null, newToken)
      return await axios(originalRequest)
    }
    throw new TokenRefreshError()
  } catch (refreshError: unknown) {
    processQueue(refreshError, null)
    useToast().toast.error(i18n.global.t('auth.sessionExpired'))
    if (config.api.logoutOnUnauthorized) {
      authStore.clearData()
      await redirectToLoginPage(window.location)
    }
    throw refreshError instanceof Error ? refreshError : new Error(String(refreshError))
  } finally {
    isRefreshing = false
  }
}
