export type AuthProvider = 'facebook' | 'gitHub' | 'google' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const DEFAULT_CHAT_BOT_ID = 'd99468d6-2153-5493-95dc-7cf06043f471'

export const config = {
  appId: import.meta.env.VITE_APP_ID ?? 'saasbase',
  appDomain: import.meta.env.VITE_APP_DOMAIN ?? 'saasbase.com',
  appName: import.meta.env.VITE_APP_NAME ?? 'SaasBase',
  timeZone: 'Europe/Warsaw',
  chat: {
    enabled: import.meta.env.VITE_CHAT_ENABLED ? import.meta.env.VITE_CHAT_ENABLED === '1' : true,
    botId: import.meta.env.VITE_CHAT_BOT_ID ?? DEFAULT_CHAT_BOT_ID,
    streaming: import.meta.env.VITE_CHAT_STREAMING ? import.meta.env.VITE_CHAT_STREAMING === '1' : true,
  },
  aiChat: {
    enabled: import.meta.env.VITE_AI_CHAT_ENABLED === '1',
  },
  auth: {
    providers: {
      gitHub: import.meta.env.VITE_OAUTH_GITHUB ? import.meta.env.VITE_OAUTH_GITHUB === '1' : true,
      google: import.meta.env.VITE_OAUTH_GOOGLE ? import.meta.env.VITE_OAUTH_GOOGLE === '1' : false,
      facebook: import.meta.env.VITE_OAUTH_FACEBOOK ? import.meta.env.VITE_OAUTH_FACEBOOK === '1' : false,
      linkedIn: import.meta.env.VITE_OAUTH_LINKEDIN ? import.meta.env.VITE_OAUTH_LINKEDIN === '1' : false,
    },
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL ?? '/api/v1',
    mockBackend: import.meta.env.VITE_API_MOCK === '1',
    logoutOnUnauthorized: false,
  },
}
