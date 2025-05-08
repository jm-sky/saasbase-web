import api from '@/lib/api'

export interface IUserSettings {
  language?: string
  theme?: string
  timezone?: string
  preferences?: object
}

class UserSettingsService {
  async show(): Promise<IUserSettings> {
    const response = await api.get<IUserSettings>('/user/settings')

    return response.data
  }

  async update(data: IUserSettings): Promise<void> {
    await api.put('/user/settings', data)
  }

  async changeLanguage(language: string): Promise<void> {
    await api.put('/user/settings/language', { language })
  }
}

export const userSettingsService = new UserSettingsService()
