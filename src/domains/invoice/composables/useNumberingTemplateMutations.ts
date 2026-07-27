import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { numberingTemplateService } from '../services/NumberingTemplate.service'
import { numberingTemplateKeys } from './numberingTemplateQueryKeys'
import type { IInvoiceNumberingTemplateForm } from '../types/numberingTemplate.type'

export function useCreateNumberingTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IInvoiceNumberingTemplateForm) => numberingTemplateService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: numberingTemplateKeys.lists() })
    },
  })
}

export function useUpdateNumberingTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IInvoiceNumberingTemplateForm> }) => numberingTemplateService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: numberingTemplateKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: numberingTemplateKeys.detail(id) })
    },
  })
}

export function useDeleteNumberingTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => numberingTemplateService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: numberingTemplateKeys.lists() })
    },
  })
}

export function useSetDefaultNumberingTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => numberingTemplateService.setDefault(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: numberingTemplateKeys.lists() })
    },
  })
}
