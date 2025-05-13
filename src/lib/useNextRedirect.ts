import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useNextRedirect = (next?: string) => {
  const route = useRoute()
  const redirectTo = computed(() => {
    if (next) return next
    if (route.query.next) return route.query.next as string

    return '/'
  })

  return { redirectTo }
}