import api from '@/helpers/api'

export interface VerifyEmailParams {
  email: string
  token: string
}

export const verifyEmail = async ({ email, token }: VerifyEmailParams) => {
  const response = await api.post('/email/verify', { email, token })
  return response.data
}
