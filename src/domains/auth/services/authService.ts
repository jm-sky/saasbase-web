import dayjs from 'dayjs'
import { v4 } from 'uuid'
import { ZodError } from 'zod'
import { type SessionData, useAuthStore } from '@/domains/auth/store/auth.store'
import { User } from '@/domains/user/models/user.model'
import { type IUser } from '@/domains/user/types/user.type'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import type { Credentials, RegistrationData, ResetPasswordData } from '@/domains/auth/types/auth.type'

const SESSION_LIFETIME = 15

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: unknown
}
 
export class AuthService {
  private createSession(user: User): SessionData {
    const session: SessionData = {
      id: v4(),
      user,
      startedAt: (new Date()).toISOString(),
      expiresAt: dayjs().add(SESSION_LIFETIME, 'minutes').toISOString(),
    }

    return session
  }

  async login(credentials: Credentials): Promise<SessionData | ZodError<Credentials>> {
    const authStore = useAuthStore()

    const response = (await api.post<LoginResponse>(apiRoutesMap.authLogin, credentials)).data

    authStore.setToken(response.accessToken)
    // Refresh token - saved in http-only cookie 
    // authStore.setRefreshToken(response.refreshToken)
    authStore.session = this.createSession(await this.getUser())

    return authStore.session
  }

  async getUser() {
    const response = (await api.get<IUser>(apiRoutesMap.user)).data
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

  async register(registrationData: RegistrationData): Promise<SessionData | ZodError<RegistrationData>> {
    const authStore = useAuthStore()

    const { token } = (await api.post<{ token: string }>(apiRoutesMap.authRegister, registrationData)).data

    authStore.setToken(token)
    authStore.session = this.createSession(await this.getUser())

    return authStore.session
  }
}

export const authService = new AuthService()
