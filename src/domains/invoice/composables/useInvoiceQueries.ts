import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { invoiceService, type IInvoiceFilters } from '../services/invoiceService'
import { invoiceKeys } from './queryKeys'

export function useInvoiceList(filters: MaybeRefOrGetter<IInvoiceFilters>) {
  return useQuery({
    queryKey: computed(() => invoiceKeys.list(toValue(filters))),
    queryFn: () => invoiceService.index(toValue(filters)),
    placeholderData: previousData => previousData,
  })
}

export function useInvoice(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => invoiceKeys.detail(toValue(id) ?? '')),
    queryFn: () => {
      const invoiceId = toValue(id)
      if (!invoiceId) throw new Error('Invoice id is required')
      return invoiceService.get(invoiceId)
    },
    enabled: computed(() => !!toValue(id)),
  })
}
