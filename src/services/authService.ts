import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { ZodError, z } from 'zod';
import type { IUser } from '@/models/user.model';
import { useAuthStore, type SessionData } from '@/stores/auth.store';

export interface Credentials {
  email: string
  password: string
  remember?: boolean
}

export interface ResetPasswordData {
  email: string
}

const SESSION_LIFETIME = 15;

export const credentialsSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(4),
  remember: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().min(1),
});

export class AuthService {
  private getUser(data: Credentials): IUser {
    const user: IUser = {
      id: v4(),
      name: 'John',
      lastName: 'Doe',
      email: data.email,
      createdAt: new Date(),
    };

    return user;
  }

  private createSession(user: IUser): SessionData {
    const session: SessionData = {
      id: v4(),
      user,
      startedAt: (new Date()).toISOString(),
      expiresAt: dayjs().add(SESSION_LIFETIME, 'minutes').toISOString(),
    };

    return session;
  }

  async login(credentials: Credentials): Promise<SessionData | ZodError<Credentials>> {
    const authStore = useAuthStore();
    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data, error, success: isValid } = credentialsSchema.safeParse(credentials);

    if (!isValid) {
      return error;
    }

    const user = this.getUser(data);
    const session = this.createSession(user);

    authStore.session = session;

    return session;
  }

  async logout() {
    const authStore = useAuthStore();

    authStore.session = null;
  }
  
  async resetPassword(data: ResetPasswordData) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return data;
  }
}

export const authService = new AuthService();
