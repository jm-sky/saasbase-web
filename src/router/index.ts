import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@/config'
import { i18n } from '@/i18n'
import { sentenceCase } from '@/lib/sentenceCase'
import { useMiddleware } from '@/router/useMiddleware'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
})

useMiddleware({ router })

router.afterEach((to) => {
  const appName = config.appName
  const metaTitle = to.meta.title as string | undefined
  const tmpTitle = to.fullPath.split('/').pop()
  const title = metaTitle ? i18n.global.t(metaTitle) : sentenceCase(tmpTitle)

  document.title = title ? `${appName} | ${title}` : appName
})

export default router
