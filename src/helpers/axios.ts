import axiosLib, { HttpStatusCode } from 'axios'
import { DEFAULT_LOCALE } from '@/plugins/i18n'
import type { AxiosError, AxiosResponse } from 'axios'

const axios = axiosLib.create({
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': DEFAULT_LOCALE,
  },
})

axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<any>): Promise<any> => {
    const { response } = error

    if (response?.status === HttpStatusCode.Unauthorized || response?.status === HttpStatusCode.Forbidden) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    throw error
  },
)


export default axios
