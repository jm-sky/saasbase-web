import { AxiosError, HttpStatusCode } from 'axios'
import router from '@/router'
import { routeMap } from '@/router/routeMap'

const isTwoFactorRequired = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    (error.response?.status === HttpStatusCode.Forbidden) &&
    error.response?.data?.actionRequired === 'verify-2fa'
  )
}

export const interceptTwoFactorRequired = async (error: AxiosError): Promise<unknown> => {
  if (!isTwoFactorRequired(error)) {
    throw error
  }

  if (router.currentRoute.value.name !== routeMap.auth.mfaVerify) {
    await router.push({ name: routeMap.auth.mfaVerify })
  }

  return Promise.reject(error)
}
