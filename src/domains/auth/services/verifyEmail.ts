import { api } from '@/lib/axios'

export interface VerifyEmailParams {
  id: string
  hash: string
}

export const verifyEmail = async ({ id, hash }: VerifyEmailParams) => {
  const response = await api.get(`/email/verify/${id}/${hash}`)
  return response.data
}
