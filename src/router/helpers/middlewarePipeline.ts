import type { RouterMiddleware, RouterMiddlewareOptions } from '../hooks/runMiddlewarePipeline'
import type { NavigationGuardNext } from 'vue-router'

export type INextPipeline = ((params?: any) => void) | NavigationGuardNext

const middlewarePipeline = (context: RouterMiddlewareOptions, middlewares: RouterMiddleware[], index: number): INextPipeline => {
  const nextMiddleware = middlewares[index]

  if (!nextMiddleware) {
    return context.next
  }

  return (params: any)=> {
    if (params) { context.next(params); return }

    const nextPipeline: any = middlewarePipeline(context, middlewares, index + 1)

    return nextMiddleware({ ...context, next: nextPipeline }) as NavigationGuardNext
  }
}

export default middlewarePipeline
