import { load } from 'recaptcha-v3'
import { config } from '@/config'

export type RepatchaAction = 'login' | 'register' | 'forgot-password'

export const useRepatcha = () => {
  const getToken = async (action: RepatchaAction) => {
    const recaptcha = await load(config.api.recaptchaKey)
    const token = await recaptcha.execute(action)
    return token
  }

  return { getToken }
}