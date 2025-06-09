import { useAuthStore } from '@/domains/auth/store/auth.store'
import { type IUser } from '@/domains/user/types/user.type'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { Credentials, ForgotPasswordData, RegistrationData, ResetPasswordData } from '@/domains/auth/types/auth.type'

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface VerifyEmailParams {
  email: string
  token: string
}

class AuthService {
  async login(credentials: Credentials): Promise<void> {
    const authStore = useAuthStore()

    const { accessToken } = (await api.post<AuthResponse>(apiRoutesMap.authLogin, credentials)).data

    authStore.setToken(accessToken)
    // Refresh token - saved in http-only cookie
  }

  async getMe(): Promise<IUser> {
    const user = (await api.get<{ data: IUser}>(apiRoutesMap.me)).data.data
    return user
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async logout() {
    useAuthStore().clearData()
  }

  async sendResetLinkEmail(data: ForgotPasswordData): Promise<void> {
    await api.post<{ message: string }>(apiRoutesMap.authForgotPassword, data)
  }

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post<{ message: string }>(apiRoutesMap.authResetPassword, data)
    return response
  }

  async register(registrationData: RegistrationData): Promise<void> {
    const authStore = useAuthStore()

    const { accessToken } = (await api.post<AuthResponse>(apiRoutesMap.authRegister, registrationData)).data

    authStore.setToken(accessToken)
  }

  async resendEmailVerification(email: string) {
    await api.post(apiRoutesMap.authResendEmailVerification, { email })
  }


  async verifyEmail({ email, token }: VerifyEmailParams) {
    const response = await api.post(apiRoutesMap.authVerifyEmail, { email, token })
    return response.data
  }

}

export const authService = new AuthService()
