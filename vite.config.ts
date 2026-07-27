import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import monacoEditorPluginImport from 'vite-plugin-monaco-editor'
import { pwaPlugin } from './pwa.config'

// CJS package: Vite 8 ESM interop nests the factory under `.default`
const monacoEditorPlugin =
  typeof monacoEditorPluginImport === 'function'
    ? monacoEditorPluginImport
    : (monacoEditorPluginImport as { default: typeof monacoEditorPluginImport }).default

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    vue(),
    tailwindcss(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html', 'css']
    }),
    pwaPlugin,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(execSync('git rev-parse --short HEAD').toString().trim()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  server: {
    port: parseInt(`${process.env.VITE_APP_PORT ?? 5176}`),
    proxy: {
      '/api': {
        target: process.env.VITE_API_HOST ?? 'http://localhost:8989',
        // target: 'https://dummyjson.com',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  watch: {
    ignored: ['.docs/**'],
  },
}))
