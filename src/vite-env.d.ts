/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEBUG?: boolean
    readonly VITE_DEFAULT_LOGIN?: string
    readonly VITE_DEFAULT_PASSWORD?: string
    readonly VITE_API_HOST?: string
    readonly VITE_APP_PORT?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
