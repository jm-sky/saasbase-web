import { useApi } from '@/composables/useApi'

const { api, setAuthorization } = useApi()

export const setApiAuthorization = (token?: string | null) => {
  setAuthorization(token)
}

export default api
