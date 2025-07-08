import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IVatRate } from '../types/vatRate.type'

export const useVatRateStore = defineStore('vatRate', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const vatRates = useSessionStorage<IVatRate[]>(`${config.appId}:vatRates`, [], { serializer: StorageSerializers.object })

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      vatRates.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    vatRates,
  }
})
