import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IInvoiceTemplatePreview } from '../types/invoiceTemplate.type'

export const useInvoiceTemplateStore = defineStore('invoiceTemplate', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const invoiceTemplate = ref<IInvoiceTemplatePreview | null>(null)
  const invoiceTemplates = useSessionStorage<IInvoiceTemplatePreview[]>(`${config.appId}:invoiceTemplates`, [], { serializer: StorageSerializers.object })

  const setTemplateById = (id: string) => {
    if (invoiceTemplate.value?.id === id) return
    invoiceTemplate.value = invoiceTemplates.value.find(template => template.id === id) ?? null
  }

  const setTemplate = (template: IInvoiceTemplatePreview) => {
    invoiceTemplate.value = template
  }

  watch(tenantId, (newValue, oldValue) => {
    if (oldValue && newValue && oldValue !== newValue) {
      invoiceTemplate.value = null
      invoiceTemplates.value = []
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    invoiceTemplate,
    invoiceTemplates,
    setTemplateById,
    setTemplate,
  }
})
