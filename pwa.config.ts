import { VitePWA } from 'vite-plugin-pwa'

export const pwaPlugin = VitePWA({
  registerType: 'prompt',
  includeAssets: [
    'icons/icon-16x16.png',
    'icons/icon-32x32.png',
    'icons/icon-48x48.png',
    'icons/icon-72x72.png',
    'icons/icon-96x96.png',
    'icons/icon-120x120.png',
    'icons/icon-144x144.png',
    'icons/icon-152x152.png',
    'icons/icon-180x180.png',
    'icons/icon-192x192.png',
    'icons/icon-256x256.png',
    'icons/icon-384x384.png',
    'icons/icon-512x512.png',
    'icons/icon-512x512-maskable.png',
  ],
  manifest: {
    name: 'SaaSBase',
    short_name: 'SaaSBase',
    description: 'SaaSBase — multi-tenant SaaS business management platform.',
    theme_color: '#0ea5e9',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      { src: 'icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: 'icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: 'icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { src: 'icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: 'icons/icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { src: 'icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { src: 'icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { src: 'icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
      { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  // App-shell precache only (JS/CSS/HTML/icons) — no runtimeCaching rules, so
  // API responses are never cached and the app has no offline mode.
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    // Monaco's language worker bundles are huge (the TS worker alone is ~12MB)
    // and lazily loaded only when the template/code editor is opened — not
    // part of the app shell, so they're excluded from precache entirely.
    globIgnores: ['**/monacoeditorwork/**'],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  },
  devOptions: {
    enabled: false,
  },
})
