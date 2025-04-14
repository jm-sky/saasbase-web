import dayjs from 'dayjs'
import { v4 } from 'uuid'
import { ZodError } from 'zod'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IUser, User } from '@/models/user.model'
import { type SessionData, useAuthStore } from '@/stores/auth.store'
import type { Credentials, RegistrationData, ResetPasswordData } from '@/types/auth.type'

const SESSION_LIFETIME = 15

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

    const response = (await api.post<{ token: string }>(apiRoutesMap.authLogin, credentials)).data

    authStore.setToken(response.token)
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
