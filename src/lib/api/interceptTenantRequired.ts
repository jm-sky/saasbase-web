import { AxiosError, HttpStatusCode } from 'axios'
import router from '@/router'
import { routeMap } from '@/router/routeMap'

const isTenantRequired = (error: unknown): boolean => {
  if (!(error instanceof AxiosError) || error.response?.status !== HttpStatusCode.Forbidden) {
    return false
  }

  return error.response.data?.actionRequired === 'select-tenant'
}

export const interceptTenantRequired = (error: AxiosError): Promise<unknown> => {
  if (!isTenantRequired(error)) {
    throw error
  }

  const current = router.currentRoute.value

  // Prefer the dedicated page over a modal-on-dashboard — selecting a tenant
  // while widgets are already failing just re-opens the dialog and leaves
  // red errors behind.
  if (current.name !== routeMap.auth.selectTenant) {
    void router.push({
      name: routeMap.auth.selectTenant,
      query: current.fullPath && current.fullPath !== '/'
        ? { next: current.fullPath }
        : undefined,
    })
  }

  return Promise.reject(error)
}
