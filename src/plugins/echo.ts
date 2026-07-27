// src/plugins/echo.ts
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { config } from '@/config'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

const tokenStorageKey = `${config.appId}:token`

const readBearerToken = (): string | null => localStorage.getItem(tokenStorageKey)

const authHeaderValue = (token: string | null): string =>
  token ? `Bearer ${token}` : ''

const echo = new Echo({
  broadcaster: 'pusher' as const,
  key: config.pusher.appKey,
  cluster: config.pusher.appCluster,
  wsHost: config.pusher.wsHost,
  wsPort: config.pusher.wsPort,
  wssPort: config.pusher.wssPort,
  forceTLS: config.pusher.forceTLS,
  encrypted: config.pusher.encrypted,
  disableStats: true,
  enabledTransports: ['ws', 'wss'] as ('ws' | 'wss')[],
  authEndpoint: `${config.api.baseUrl}/broadcasting/auth`,
  auth: {
    headers: {
      // Updated on login / token refresh / logout via syncEchoAuthToken.
      // Echo reads connector.options.auth.headers for each /broadcasting/auth call.
      Authorization: authHeaderValue(readBearerToken()),
    },
  },
})

/** Keep connector auth headers in sync after login / refresh / logout. */
export const syncEchoAuthToken = (token: string | null): void => {
  const connector = echo.connector as { options?: { auth?: { headers?: Record<string, string> } } }
  if (!connector.options) {
    connector.options = {}
  }
  if (!connector.options.auth) {
    connector.options.auth = { headers: {} }
  }
  if (!connector.options.auth.headers) {
    connector.options.auth.headers = {}
  }
  connector.options.auth.headers.Authorization = authHeaderValue(token)
}

export default echo
