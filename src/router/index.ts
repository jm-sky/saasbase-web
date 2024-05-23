import { createRouter, createWebHistory } from 'vue-router';
import { useMiddleware } from '@/router/useMiddleware';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
});

useMiddleware({ router });

export default router;
