import { useRouteParams } from '@vueuse/router'
import { defineStore } from 'pinia'
import { ref, type Ref, watch } from 'vue'
import type { IInvoice } from '../types/invoice.type'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoice: Ref<IInvoice | null> = ref(null)
  const invoices: Ref<IInvoice[]> = ref([])

  const routeId = useRouteParams<string | undefined>('id')

  const setInvoice = (invoiceData: IInvoice) => invoice.value = invoiceData

  watch(routeId, (id: string | undefined) => {
    if (id && id !== invoice.value?.id) {
      invoice.value = null
    }
  },{
    flush: 'pre',
  })

  return {
    invoice,
    invoices,
    setInvoice,
  }
})