import { useAuthStore } from '@/domains/auth/store/auth.store'
import { User } from '@/domains/user/models/user.model'
import { type IUser } from '@/domains/user/types/user.type'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import type { Credentials, RegistrationData, ResetPasswordData } from '@/domains/auth/types/auth.type'

export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number
}

export class AuthService {
  async login(credentials: Credentials): Promise<void> {
    const authStore = useAuthStore()

    const { token } = (await api.post<AuthResponse>(apiRoutesMap.authLogin, credentials)).data

    authStore.setToken(token)
    // Refresh token - saved in http-only cookie
  }

  async getUser() {
    const response = (await api.get<IUser>(apiRoutesMap.me)).data
    return User.load(response)
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

    const { token } = (await api.post<AuthResponse>(apiRoutesMap.authRegister, registrationData)).data

    authStore.setToken(token)
  }
}

export const authService = new AuthService()
