import { useRouteParams } from '@vueuse/router'
import { defineStore } from 'pinia'
import { ref, type Ref, watch } from 'vue'
import type { IProduct } from '../types/product.type'

export const useProductStore = defineStore('product', () => {
  const product: Ref<IProduct | null> = ref(null)
  const products: Ref<IProduct[]> = ref([])

  const routeId = useRouteParams<string | undefined>('id')

  const setProduct = (productData: IProduct) => product.value = productData

  watch(routeId, (id: string | undefined) => {
    if (id && id !== product.value?.id) {
      product.value = null
    }
  },{
    flush: 'pre',
  })

  return {
    product,
    products,
    setProduct,
  }
})