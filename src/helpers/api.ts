import axiosLib, { HttpStatusCode } from 'axios'
import { DEFAULT_LOCALE } from '@/plugins/i18n'
import type { AxiosError, AxiosResponse } from 'axios'

const api = axiosLib.create({
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': DEFAULT_LOCALE,
  },
})

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<unknown> => {
    const { response } = error

    if (response?.status === HttpStatusCode.Unauthorized || response?.status === HttpStatusCode.Forbidden) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    throw error
  },
)

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}


export default api
