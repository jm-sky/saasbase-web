import { AxiosError, type AxiosResponse, HttpStatusCode } from 'axios'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/components/ui/toast'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const AUTH_TOKEN_URL = '/api/auth/token'
const AUTH_REFRESH_TOKEN_URL = '/api/auth/token/refresh'

const wasTokenRequest = (error: AxiosError): boolean => error.config?.url?.endsWith(AUTH_TOKEN_URL) ?? false
const wasRefreshTokenRequest = (error: AxiosError): boolean => error.config?.url?.endsWith(AUTH_REFRESH_TOKEN_URL) ?? false
const isResponseUnauthorized = (response?: AxiosResponse): boolean => response?.status === HttpStatusCode.Unauthorized || response?.status === HttpStatusCode.Forbidden
const redirectToLoginPage = async (location: Location) => {
  if (location.pathname !== '/login') {
    await router.push('/login')
  }
}

export const interceptUnauthorized = async (error: AxiosError): Promise<unknown> => {
  if (!isResponseUnauthorized(error.response)) {
    throw error
  }

  const authStore = useAuthStore()

  if (wasTokenRequest(error)) {
    authStore.clearData()
    await redirectToLoginPage(window.location)
    throw error
  }

  if (wasRefreshTokenRequest(error)) {
    authStore.clearData()
    await redirectToLoginPage(window.location)
    throw error
  }

  if (!authStore.isAuthenticated) {
    authStore.clearData()
    await redirectToLoginPage(window.location)
    throw error
  }

  const { t } = useI18n()

  useToast().toast.error(t('auth.sessionExpired'))
  authStore.clearData()
  await redirectToLoginPage(window.location)

  throw error
}
