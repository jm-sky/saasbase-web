import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { expenseService, type IExpenseFilters } from '../services/expenseService'
import { expenseKeys } from './queryKeys'

export function useExpenseList(filters: MaybeRefOrGetter<IExpenseFilters>) {
  return useQuery({
    queryKey: computed(() => expenseKeys.list(toValue(filters))),
    queryFn: () => expenseService.index(toValue(filters)),
    placeholderData: previousData => previousData,
  })
}

export function useExpense(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => expenseKeys.detail(toValue(id) ?? '')),
    queryFn: () => {
      const expenseId = toValue(id)
      if (!expenseId) throw new Error('Expense id is required')
      return expenseService.get(expenseId)
    },
    enabled: computed(() => !!toValue(id)),
  })
}
