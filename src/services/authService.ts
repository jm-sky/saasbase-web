import dayjs from 'dayjs'
import { v4 } from 'uuid'
import { z, ZodError } from 'zod'
import api from '@/helpers/api'
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
  private userFromCredentials(data: Credentials): IUser {
    const user: IUser = {
      id: v4(),
      name: 'John',
      lastName: 'Doe',
      email: data.email,
      createdAt: new Date(),
    }

    return user
  }

  private userFromRegistration(data: RegistrationData): IUser {
    const user: IUser = {
      id: v4(),
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      createdAt: new Date(),
    }

    return user
  }

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
    
    const response = (await api.post<{ token: string }>('/api/auth/login', credentials)).data

    authStore.setToken(response.token)

    // const { data, error, success: isValid } = credentialsSchema.safeParse(credentials)

    // if (!isValid) {
    //   return error
    // }

    const user = await this.getUser()
    authStore.session = this.createSession(user)

    return authStore.session
  }

  async getUser() {
    const response = (await api.get<IUser>('/api/user')).data
    return response
  }

  logout() {
    useAuthStore().clearData()
  }
  
  async resetPassword(data: ResetPasswordData) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    return data
  }

  async register(registrationData: RegistrationData): Promise<SessionData | ZodError<RegistrationData>> {
    const authStore = useAuthStore()
    
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { data, error, success: isValid } = registrationSchema.safeParse(registrationData)

    if (!isValid) {
      return error
    }

    const user = this.userFromRegistration(data)
    const session = this.createSession(user)

    authStore.session = session

    return session
  }
}

export const authService = new AuthService()
