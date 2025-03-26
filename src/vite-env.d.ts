/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEFAULT_LOGIN?: string
    readonly VITE_DEFAULT_PASSWORD?: string
    readonly VITE_API_HOST?: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
