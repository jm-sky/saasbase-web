import { config } from '@/config'
import { i18n } from '@/i18n'
import { sentenceCase } from '@/lib/sentenceCase'
import type { RouteLocationNormalized } from 'vue-router'

export const setRouteTitle = (route: RouteLocationNormalized, suffix?: string) => {
  const appName = config.appName
  const metaTitle = route.meta.title as string | undefined
  const tmpTitle = route.fullPath.split('/').pop()
  const computedTitle = metaTitle ? i18n.global.t(metaTitle) : sentenceCase(tmpTitle)

  if (suffix) {
    document.title = computedTitle ? `${appName} | ${computedTitle} | ${suffix}` : `${appName} | ${suffix}`
  } else {
    document.title = computedTitle ? `${appName} | ${computedTitle}` : appName
  }
}
