export type AuthProvider = 'facebook' | 'gitHub' | 'google' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const config = {
  appId: import.meta.env.VITE_APP_ID ?? 'saasbase',
  appName: import.meta.env.VITE_APP_NAME ?? 'SaaS Base',
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
