import api from '@/lib/api'

class OAuthService {
  async getOAuthRedirectUrl(provider: 'gitHub' | 'google') {
    const response = await api.get<{ url: string }>(`/oauth/${provider}/redirect`)
    return response.data.url
  }
}

export const oauthService = new OAuthService()
