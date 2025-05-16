import './style/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'floating-vue/dist/style.css'
import { vTooltip } from 'floating-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { i18n } from '@/i18n'
import App from './App.vue'
import DebugConsolePlugin from './plugins/DebugConsolePlugin'
import router from './router'
import { Icon } from '@iconify/vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(DebugConsolePlugin)
app.component('Icon', Icon)
app.directive('tooltip', vTooltip)
app.mount('#app')
