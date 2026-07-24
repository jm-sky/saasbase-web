import type { RouterMiddleware, RouterMiddlewareOptions } from '../hooks/runMiddlewarePipeline'
import type { NavigationGuardNext } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-deprecated -- vue-router 5 still fully supports the next() callback guard pattern (deprecated, slated for a future removal); this whole middleware pipeline is built around it and migrating to return-value guards is a separate, larger refactor
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

    // eslint-disable-next-line @typescript-eslint/no-deprecated -- see note above
    return nextMiddleware({ ...context, next: nextPipeline }) as NavigationGuardNext
  }
}

export default middlewarePipeline
