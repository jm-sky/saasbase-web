import { AxiosError, HttpStatusCode } from 'axios'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const isTwoFactorRequired = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    (error.response?.status === HttpStatusCode.Forbidden) &&
    error.response.data.actionRequired === 'verify-2fa'
  )
}

// Backstop for is2faRequested (router middleware): that already blocks
// navigation for a token with mfa=1, but a token can only be replaced by a
// fresh login/verify, so any request racing an in-flight 2FA state should
// still be routed to /2fa-verify instead of surfacing a raw 403.
export const interceptTwoFactorRequired = (error: AxiosError): Promise<unknown> => {
  if (!isTwoFactorRequired(error)) {
    throw error
  }

  const authStore = useAuthStore()
  authStore.needsTwoFactorVerification = true

  return Promise.reject(error)
}
