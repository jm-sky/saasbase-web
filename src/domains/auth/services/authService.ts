import { useAuthStore } from '@/domains/auth/store/auth.store'
import { type IUser } from '@/domains/user/types/user.type'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import type { Credentials, RegistrationData, ResetPasswordData } from '@/domains/auth/types/auth.type'

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface MfaVerifyResponse {
  message: string
}

export interface MfaSetupResponse {
  secret: string
  qrCodeUrl: string
  recoveryCodes: string[]
}

export class AuthService {
  async login(credentials: Credentials): Promise<void> {
    const authStore = useAuthStore()

    const { accessToken } = (await api.post<AuthResponse>(apiRoutesMap.authLogin, credentials)).data

    authStore.setToken(accessToken)
    // Refresh token - saved in http-only cookie
  }

  async getMe(): Promise<IUser> {
    const user = (await api.get<IUser>(apiRoutesMap.me)).data
    return user
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async logout() {
    useAuthStore().clearData()
  }

  async resetPassword(data: ResetPasswordData) {
    const response = await api.post<{ message: string }>(apiRoutesMap.authResetPassword, data)
    return response
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post<{ message: string }>(apiRoutesMap.authForgotPassword, { email })
  }

  async register(registrationData: RegistrationData): Promise<void> {
    const authStore = useAuthStore()

    const { accessToken } = (await api.post<AuthResponse>(apiRoutesMap.authRegister, registrationData)).data

    authStore.setToken(accessToken)
  }

  async resendEmailVerification(email: string) {
    await api.post(apiRoutesMap.authResendEmailVerification, { email })
  }

  async verify2fa(code: string) {
    const response = await api.post<MfaVerifyResponse>(apiRoutesMap.auth2faVerify, { code })
    return response.data
  }

  async setup2fa() {
    const response = await api.post<MfaSetupResponse>(apiRoutesMap.auth2faSetup)
    return response.data
  }
}

export const authService = new AuthService()
