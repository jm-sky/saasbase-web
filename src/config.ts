export type AuthProvider = 'facebook' | 'gitHub' | 'google' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const config = {
  appId: 'saasbase',
  appName: 'SaasBase',
  auth: {
    providers: {
      gitHub: true,
      google: false,
      facebook: false,
      linkedIn: false,
    },
  },
  api: {
    mockBackend: true,
  },
}
