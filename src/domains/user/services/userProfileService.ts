import api from '@/lib/api'

export interface IUserProfile {
  bio: string | null
  location: string | null
  birthDate: string | null
  position: string | null
  website: string | null
  socialLinks?: {
    facebook: string | null
    instagram: string | null
    twitter: string | null
    linkedin: string | null
    youtube: string | null
  }
}

class UserProfileService {
  async get(): Promise<IUserProfile> {
    return (await api.get('/user/profile')).data.data
  }

  async update(data: IUserProfile): Promise<void> {
    return (await api.put('/user/profile', data)).data
  }
}

export const userProfileService = new UserProfileService()
