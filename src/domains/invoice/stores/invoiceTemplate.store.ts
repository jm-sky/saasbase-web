import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IInvoiceTemplate } from '../types/invoiceTemplate.type'

export const useInvoiceTemplateStore = defineStore('invoiceTemplate', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const invoiceTemplates = useSessionStorage<IInvoiceTemplate[]>(`${config.appId}:invoiceTemplates`, [], { serializer: StorageSerializers.object })

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      invoiceTemplates.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    invoiceTemplates,
  }
})
