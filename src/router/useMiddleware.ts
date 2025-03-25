import { runMiddlewarePipeline } from './hooks/runMiddlewarePipeline'
import type { Router } from 'vue-router'

export const useMiddleware = ({ router }: { router: Router }): void => {
  router.beforeEach(runMiddlewarePipeline({ router }))
}
