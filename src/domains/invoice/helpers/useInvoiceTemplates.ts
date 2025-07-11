import { storeToRefs } from 'pinia'
import type { IInvoiceTemplatePreview } from '../types/invoiceTemplate.type'
import { invoiceTemplateService } from '../services/InvoiceTemplate.service'
import { useInvoiceTemplateStore } from '../stores/invoiceTemplate.store'
import type { TUUID } from '@/domains/shared/types/common'

export const useInvoiceTemplates = () => {
  const invoiceTemplateStore = useInvoiceTemplateStore()
  const { invoiceTemplate, invoiceTemplates } = storeToRefs(invoiceTemplateStore)

  const loadTemplates = async () => {
    invoiceTemplates.value = (await invoiceTemplateService.index()).data
  }

  const setTemplateById = (id: TUUID) => {
    invoiceTemplateStore.setTemplateById(id)
  }

  const setTemplate = (template: IInvoiceTemplatePreview) => {
    invoiceTemplateStore.setTemplate(template)
  }

  return {
    invoiceTemplate,
    invoiceTemplates,
    loadTemplates,
    setTemplateById,
    setTemplate,
  }
}
