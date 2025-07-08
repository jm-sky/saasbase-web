import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IPaymentMethod } from '../types/paymentMethod.type'

export const usePaymentMethodStore = defineStore('paymentMethod', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const paymentMethods = useSessionStorage<IPaymentMethod[]>(`${config.appId}:paymentMethods`, [], { serializer: StorageSerializers.object })

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      paymentMethods.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    paymentMethods,
  }
})
