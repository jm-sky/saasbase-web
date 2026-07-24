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
      // Global, route-independent: a user with 2FA enabled but not yet
      // verified this session (JWT mfa=1) must resolve that before going
      // anywhere else, mirroring the backend's `mfa` middleware applied
      // across the API's protected route groups. Deliberately not opt-in
      // per route like isAuthenticated/isVerified below -- that pattern is
      // exactly how this check ended up wired into zero routes previously.
      const twoFactorRedirect = is2faRequested(to)

      if (true !== twoFactorRedirect) {
        next(twoFactorRedirect); return
      }

      const middlewares: RouterMiddleware[] | undefined = to.meta.middlewares
      const firstMiddleware = middlewares?.[0]

      if (!firstMiddleware) {
        next(); return
      }

      const context = {
        to,
        from,
        next,
        router,
      }

      return firstMiddleware({ ...context, next: middlewarePipeline(context, middlewares, 1) })
    }
