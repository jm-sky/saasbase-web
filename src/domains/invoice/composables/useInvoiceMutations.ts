import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { invoiceService } from '../services/invoiceService'
import { invoiceKeys } from './queryKeys'
import type { IInvoice, IInvoiceCreate } from '../types/invoice.type'

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IInvoiceCreate) => invoiceService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IInvoice> }) => invoiceService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) })
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => invoiceService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
    },
  })
}
