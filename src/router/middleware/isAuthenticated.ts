import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline';
import { useAuthStore } from '@/stores/auth.store';

export const isAuthenticated = ({ next }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return next({ name: 'login' });
  }

  return next();
};
