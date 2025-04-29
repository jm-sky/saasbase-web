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
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return data
  }

  async register(registrationData: RegistrationData): Promise<void> {
    const authStore = useAuthStore()

    const { accessToken } = (await api.post<AuthResponse>(apiRoutesMap.authRegister, registrationData)).data

    authStore.setToken(accessToken)
  }
}

export const authService = new AuthService()
