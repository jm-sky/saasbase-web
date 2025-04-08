import dayjs from 'dayjs'
import { v4 } from 'uuid'
import { z, ZodError } from 'zod'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type SessionData, useAuthStore } from '@/stores/auth.store'
import type { IUser } from '@/models/user.model'

export interface Credentials {
  email: string
  password: string
  remember?: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface RegistrationData {
  email: string
  lastName: string
  name: string
  password: string
}

const SESSION_LIFETIME = 15

export const credentialsSchema = z.object({
  email: z.string().email().min(1).max(50),
  password: z.string().min(4).max(50),
  remember: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  email: z.string().email().min(1).max(50),
})

export const registrationSchema = z.object({
  name: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().min(1).max(50),
  password: z.string().min(4).max(50),
})

export class AuthService {
  private createSession(user: IUser): SessionData {
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

    const { data, error, success: isValid } = credentialsSchema.safeParse(credentials)

    if (!isValid) {
      return error
    }

    const response = (await api.post<{ token: string }>(apiRoutesMap.authLogin, data)).data

    authStore.setToken(response.token)
    authStore.session = this.createSession(await this.getUser())

    return authStore.session
  }

  async getUser() {
    const response = (await api.get<IUser>(apiRoutesMap.user)).data
    return response
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

    const { data, error, success: isValid } = registrationSchema.safeParse(registrationData)

    if (!isValid) {
      return error
    }

    const { token } = (await api.post<{ token: string }>(apiRoutesMap.authRegister, data)).data

    authStore.setToken(token)
    authStore.session = this.createSession(await this.getUser())

    return authStore.session
  }
}

export const authService = new AuthService()
