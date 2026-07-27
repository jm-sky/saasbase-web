import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export function mountComposable<T>(
  composable: () => T,
): { result: T, queryClient: QueryClient, wrapper: VueWrapper } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  let result!: T

  const Wrapper = defineComponent({
    setup() {
      result = composable()
      return () => null
    },
  })

  const wrapper = mount(Wrapper, {
    global: {
      plugins: [[VueQueryPlugin, { queryClient }]],
    },
  })

  return { result, queryClient, wrapper }
}
