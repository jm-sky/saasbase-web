import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IInvoiceNumberingTemplate } from '../types/numberingTemplate.type'

export const useNumberingTemplateStore = defineStore('numberingTemplate', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const numberingTemplates = useSessionStorage<IInvoiceNumberingTemplate[]>(`${config.appId}:numberingTemplates`, [], { serializer: StorageSerializers.object })

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      numberingTemplates.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    numberingTemplates,
  }
})
