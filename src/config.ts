export type AuthProvider = 'gitHub' | 'google' | 'facebook' | 'linkedIn'

export interface IConfig {
  auth: {
    providers: Record<AuthProvider, boolean>
  }
}

export const config = {
  auth: {
    providers: {
      gitHub: true,
      google: false,
      facebook: false,
      linkedIn: false,
    },
  },
};
