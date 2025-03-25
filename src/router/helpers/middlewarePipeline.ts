import type { RouterMiddleware, RouterMiddlewareOptions } from '../hooks/runMiddlewarePipeline'
import type { NavigationGuardNext } from 'vue-router'

export type INextPipeline = ((params?: unknown) => void) | NavigationGuardNext

const middlewarePipeline = (context: RouterMiddlewareOptions, middlewares: RouterMiddleware[], index: number): INextPipeline => {
  const nextMiddleware: RouterMiddleware | undefined = middlewares[index]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!nextMiddleware) {
    return context.next
  }

  return (params: unknown)=> {
    if (params) { context.next(params); return }

    const nextPipeline: INextPipeline = middlewarePipeline(context, middlewares, index + 1)

    return nextMiddleware({ ...context, next: nextPipeline }) as NavigationGuardNext
  }
}

export default middlewarePipeline
