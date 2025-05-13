import { AxiosError, HttpStatusCode } from 'axios'
import { useAuthStore } from '@/domains/auth/store/auth.store'


const isTenantRequired = (error: unknown): boolean => {
  return (
    error instanceof AxiosError &&
    (error.response?.status === HttpStatusCode.Forbidden) &&
    error.response.data.actionRequired === 'select-tenant'
  )
}


export const interceptTenantRequired = (error: AxiosError): Promise<unknown> => {
  if (!isTenantRequired(error)) {
    throw error
  }

  const authStore = useAuthStore()
  authStore.showSelectTenantModal = true

  return Promise.reject(error)
}
