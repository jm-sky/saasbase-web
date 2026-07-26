import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { expenseService, type IUploadForOcr } from '../services/expenseService'
import { expenseKeys } from './queryKeys'
import type { IExpense, IExpenseCreate } from '../types/expense.type'
import type { TUUID } from '@/domains/shared/types/common'

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IExpenseCreate) => expenseService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IExpense> }) => expenseService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useUploadExpensesForOcr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: IUploadForOcr) => expenseService.uploadForOcr(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useStartExpenseOcr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mediaId }: { id: string, mediaId?: TUUID }) => expenseService.startOcr(id, mediaId),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}
