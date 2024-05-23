import middlewarePipeline from '../helpers/middlewarePipeline';
import type { INextPipeline } from '../helpers/middlewarePipeline';
import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

export type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean

export interface RunMiddlewarePipelineOptions {
  router: Router
}

export interface RouterMiddlewareOptions {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext | INextPipeline
  router: Router
}

export type RouterMiddleware = (options: RouterMiddlewareOptions) => NavigationGuardReturn

export const runMiddlewarePipeline =
  ({ router }: RunMiddlewarePipelineOptions) =>
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn => {
      const middlewares: RouterMiddleware[] | undefined = to.meta?.middlewares;
      const firstMiddleware = middlewares?.[0];

      if (!firstMiddleware) {
        return next();
      }

      const context = {
        to,
        from,
        next,
        router,
      };

      return firstMiddleware({ ...context, next: middlewarePipeline(context, middlewares, 1) });
    };
