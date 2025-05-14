export type AuthProvider = 'facebook' | 'gitHub' | 'google' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const DEFAULT_CHAT_BOT_ID = 'd99468d6-2153-5493-95dc-7cf06043f471'

export const config = {
  appId: import.meta.env.VITE_APP_ID ?? 'saasbase',
  appName: import.meta.env.VITE_APP_NAME ?? 'SaaS Base',
  timeZone: 'Europe/Warsaw',
  chat: {
    enabled: import.meta.env.VITE_CHAT_ENABLED === '1',
    botId: import.meta.env.VITE_CHAT_BOT_ID ?? DEFAULT_CHAT_BOT_ID,
  },
  aiChat: {
    enabled: import.meta.env.VITE_AI_CHAT_ENABLED === '1',
  },
  auth: {
    providers: {
      gitHub: true,
      google: false,
      facebook: false,
      linkedIn: false,
    },
  },
  api: {
    mockBackend: import.meta.env.VITE_API_MOCK === '1',
    logoutOnUnauthorized: false,
  },
}
