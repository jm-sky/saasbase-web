import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IMeasurementUnit } from '../types/measurementUnit.type'

export const useMeasurementUnitStore = defineStore('measurementUnit', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const measurementUnits = useSessionStorage<IMeasurementUnit[]>(`${config.appId}:measurementUnits`, [], { serializer: StorageSerializers.object })

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      measurementUnits.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    measurementUnits,
  }
})
