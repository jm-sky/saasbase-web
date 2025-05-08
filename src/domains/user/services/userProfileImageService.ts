import api from '@/lib/api'

class UserProfileImageService {
  async upload(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('image', file)

    await api.post('/user/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async show(): Promise<void> {
    await api.get('/user/profile-image')
  }

  async delete(): Promise<void> {
    await api.delete('/user/profile-image')
  }
}

export const userProfileImageService = new UserProfileImageService()
