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
      Authorization: `Bearer ${localStorage.getItem(`${config.appId}:token`)}`, // or your auth method
    },
  },
}

const echo = new Echo(echoOptions)

export default echo
