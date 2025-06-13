export type AuthProvider = 'facebook' | 'gitHub' | 'google' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const DEFAULT_CHAT_BOT_ID = '01JXMGRDQVE4FWTZNE1WR9K8G1'

export const config = {
  appId: import.meta.env.VITE_APP_ID ?? 'saasbase',
  appDomain: import.meta.env.VITE_APP_DOMAIN ?? 'saasbase.com',
  appName: import.meta.env.VITE_APP_NAME ?? 'SaasBase',
  timeZone: 'Europe/Warsaw',
  defaults: {
    country: import.meta.env.VITE_DEFAULTS_COUNTRY ?? 'PL',
    language: import.meta.env.VITE_DEFAULTS_LANGUAGE ?? 'pl',
    currency: import.meta.env.VITE_DEFAULTS_CURRENCY ?? 'PLN',
  },
  pusher: {
    appKey: import.meta.env.VITE_PUSHER_APP_KEY ?? 'saasbase-key',
    appCluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ?? window.location.hostname,
    wsPort: parseInt(import.meta.env.VITE_PUSHER_PORT ?? '6001'),
    wssPort: parseInt(import.meta.env.VITE_PUSHER_PORT ?? '6001'),
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    encrypted: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  },
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
    recaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY ?? '',
    mockBackend: import.meta.env.VITE_API_MOCK === '1',
    logoutOnUnauthorized: false,
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_51N0000000000000000000000000000000000000000000000000000000000000000000000000000000',
  },
}
