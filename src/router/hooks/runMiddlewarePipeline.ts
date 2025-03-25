import type { INextPipeline } from '../helpers/middlewarePipeline'
import middlewarePipeline from '../helpers/middlewarePipeline'
import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'

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
