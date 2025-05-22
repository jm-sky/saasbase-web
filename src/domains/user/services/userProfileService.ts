import api from '@/lib/api'

export interface IUserProfile {
  firstName: string | null
  lastName: string | null
  description: string | null
  birthDate: string | null
  phone: string | null
}

class UserProfileService {
  async update(data: IUserProfile): Promise<void> {
    return (await api.put('/user/profile', data)).data
  }
}

export const userProfileService = new UserProfileService()
