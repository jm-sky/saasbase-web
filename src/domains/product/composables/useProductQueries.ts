import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { productService, type IProductFilters } from '../services/ProductService'
import { productKeys } from './queryKeys'

export function useProductList(filters: MaybeRefOrGetter<IProductFilters>) {
  return useQuery({
    queryKey: computed(() => productKeys.list(toValue(filters))),
    queryFn: () => productService.index(toValue(filters)),
    placeholderData: previousData => previousData,
  })
}

export function useProduct(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => productKeys.detail(toValue(id) ?? '')),
    queryFn: () => {
      const productId = toValue(id)
      if (!productId) throw new Error('Product id is required')
      return productService.get(productId)
    },
    enabled: computed(() => !!toValue(id)),
  })
}
