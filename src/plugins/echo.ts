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

const echoOptions = {
  broadcaster: 'pusher' as const,
  key: import.meta.env.VITE_PUSHER_APP_KEY ?? '',
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
  wsHost: import.meta.env.VITE_PUSHER_HOST ?? window.location.hostname,
  wsPort: import.meta.env.VITE_PUSHER_PORT ?? 6001,
  wssPort: import.meta.env.VITE_PUSHER_PORT ?? 6001,
  forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  encrypted: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'] as ('ws' | 'wss')[],
  authEndpoint: `${config.api.baseUrl}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(`${config.appId}:token`)}`, // or your auth method
    },
  },
}

const echo = new Echo(echoOptions)

export default echo