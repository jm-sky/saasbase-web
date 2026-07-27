import { ref } from 'vue'
import type { Router } from 'vue-router'

export const isRouteLoading = ref(false)

const LOADING_DELAY_MS = 120

export const useRouteLoading = (router: Router) => {
  let loadingDelayTimer: ReturnType<typeof setTimeout> | undefined

  const clearLoading = () => {
    window.clearTimeout(loadingDelayTimer)
    loadingDelayTimer = undefined
    isRouteLoading.value = false
  }

  router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) {
      return
    }

    window.clearTimeout(loadingDelayTimer)
    loadingDelayTimer = setTimeout(() => {
      isRouteLoading.value = true
    }, LOADING_DELAY_MS)
  })

  router.afterEach(() => {
    clearLoading()
  })

  router.onError(() => {
    clearLoading()
  })
}
