import './style/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { i18n } from '@/plugins/i18n';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
