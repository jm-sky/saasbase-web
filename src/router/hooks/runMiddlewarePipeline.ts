import type { INextPipeline } from '../helpers/middlewarePipeline'
import middlewarePipeline from '../helpers/middlewarePipeline'
import { is2faRequested } from '../middleware/is2faRequested'
import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type NavigationGuardReturn = boolean | Error | RouteLocationRaw | void

export interface RunMiddlewarePipelineOptions {
  router: Router
}

export interface RouterMiddlewareOptions {
  from: RouteLocationNormalized
  next: INextPipeline | NavigationGuardNext
  router: Router
  to: RouteLocationNormalized
}

export type RouterMiddleware = (options: RouterMiddlewareOptions) => NavigationGuardReturn

export const runMiddlewarePipeline =
  ({ router }: RunMiddlewarePipelineOptions) =>
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn => {
      // is2faRequested runs on every navigation, not just routes that opted
      // in via meta.middlewares — a user with 2FA enabled but not yet passed
      // (JWT mfa=1) must be routed to /2fa-verify regardless of which page
      // they're navigating to. It's a no-op for unauthenticated users/pages
      // (no token means isTwoFactorEnabled is false).
      const middlewares: RouterMiddleware[] = [is2faRequested, ...(to.meta.middlewares ?? [])]

      const context = {
        to,
        from,
        next,
        router,
      }

      return middlewares[0]({ ...context, next: middlewarePipeline(context, middlewares, 1) })
    }
