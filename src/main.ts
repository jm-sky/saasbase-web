import './style/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'floating-vue/dist/style.css'
import { Icon } from '@iconify/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { vTooltip } from 'floating-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { i18n } from '@/i18n'
import App from './App.vue'
import DebugConsolePlugin from './plugins/DebugConsolePlugin'
import router from './router'

const app = createApp(App)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 10 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(DebugConsolePlugin)
app.use(VueQueryPlugin, { queryClient })
app.component('Icon', Icon)
app.directive('tooltip', vTooltip)
app.mount('#app')
